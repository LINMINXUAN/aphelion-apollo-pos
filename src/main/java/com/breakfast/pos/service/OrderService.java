package com.breakfast.pos.service;

import com.breakfast.pos.exception.ResourceNotFoundException;
import com.breakfast.pos.mapper.OrderMapper;
import com.breakfast.pos.model.dto.CartItemRequest;
import com.breakfast.pos.model.dto.OrderRequest;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.model.entity.Order;
import com.breakfast.pos.model.entity.OrderItem;
import com.breakfast.pos.model.entity.Product;
import com.breakfast.pos.repository.OrderRepository;
import com.breakfast.pos.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 訂單核心邏輯服務
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PrintService printService;
    private final LineService lineService;
    private final OrderMapper orderMapper;

    /**
     * 處理結帳流程
     * 包含：總額計算、持久化、觸發出單與通知
     */
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        log.info("Processing new order: type={}, table={}", request.type(), request.tableNumber());
        validateOrderRequest(request);

        if (request.idempotencyKey() != null && !request.idempotencyKey().isBlank()) {
            var existing = orderRepository.findByIdempotencyKey(request.idempotencyKey());
            if (existing.isPresent()) {
                log.info("Duplicate order detected with idempotencyKey={}, returning existing order",
                        request.idempotencyKey());
                return orderMapper.toResponse(existing.get());
            }
        }

        Order order = Order.builder()
                .type(Order.OrderType.valueOf(request.type()))
                .tableNumber(request.tableNumber())
                .idempotencyKey(request.idempotencyKey())
                .status(Order.OrderStatus.PENDING)
                .build();

        // 轉換 OrderItems 並計算總額
        var items = request.items().stream()
                .map(itemReq -> createOrderItem(order, itemReq))
                .collect(Collectors.toList());

        BigDecimal totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        // 儲存至 PostgreSQL
        Order savedOrder = orderRepository.save(order);
        log.info("Order saved successfully with ID: {}", savedOrder.getId());

        // 觸發副作用 (Side Effects)
        try {
            printService.printReceipt(savedOrder);
            lineService.notifyOrderStatusChange(savedOrder);
        } catch (Exception e) {
            log.error("Error triggering side effects for order {}: {}", savedOrder.getId(), e.getMessage());
            // 這裡可以選擇是否拋出異常或僅記錄日誌
        }

        return orderMapper.toResponse(savedOrder);
    }

    private OrderItem createOrderItem(Order order, CartItemRequest itemReq) {
        Product product = productRepository.findById(itemReq.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.productId()));

        if (!product.isAvailable()) {
            throw new IllegalStateException("Product is not available: " + product.getName());
        }

        BigDecimal subtotal = product.getPrice().multiply(new BigDecimal(itemReq.quantity()));

        return OrderItem.builder()
                .order(order)
                .product(product)
                .productName(product.getName()) // 冗餘欄位，防止商品刪除後無法查詢
                .quantity(itemReq.quantity())
                .unitPrice(product.getPrice())
                .modifiers(itemReq.modifiers())
                .subtotal(subtotal)
                .build();
    }

    private void validateOrderRequest(OrderRequest request) {
        List<CartItemRequest> items = request.items();
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be empty");
        }
        boolean invalidQuantity = items.stream().anyMatch(item -> item.quantity() <= 0);
        if (invalidQuantity) {
            throw new IllegalArgumentException("Item quantity must be greater than zero");
        }
    }
}
