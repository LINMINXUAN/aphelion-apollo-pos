package com.breakfast.pos.service;

import com.breakfast.pos.exception.ResourceNotFoundException;
import com.breakfast.pos.mapper.OrderMapper;
import com.breakfast.pos.model.dto.CartItemRequest;
import com.breakfast.pos.model.dto.OrderRequest;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.model.entity.Order;
import com.breakfast.pos.model.entity.Product;
import com.breakfast.pos.repository.OrderRepository;
import com.breakfast.pos.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PrintService printService;

    @Mock
    private LineService lineService;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("應該成功建立訂單並計算總額")
    void shouldPlaceOrderSuccessfully() {
        // Arrange
        Product product = Product.builder()
                .id(1L)
                .name("起司蛋堡")
                .price(new BigDecimal("45.00"))
                .available(true)
                .build();

        // OrderRequest(tableNumber, type, items)
        CartItemRequest itemRequest = new CartItemRequest(1L, 2, "不加洋蔥");
        OrderRequest orderRequest = new OrderRequest("A1", "DINE_IN", List.of(itemRequest), null);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(100L);
            return order;
        });

        // OrderResponse(id, status, type, tableNumber, totalAmount, createdAt, items)
        OrderResponse expectedResponse = new OrderResponse(100L, "PENDING", "DINE_IN", "A1", new BigDecimal("90.00"),
                LocalDateTime.now(), List.of());
        when(orderMapper.toResponse(any(Order.class))).thenReturn(expectedResponse);

        // Act
        OrderResponse result = orderService.placeOrder(orderRequest);

        // Assert
        assertNotNull(result);
        assertEquals(new BigDecimal("90.00"), result.totalAmount());
        assertEquals("PENDING", result.status());
        assertEquals("DINE_IN", result.type());

        verify(printService, times(1)).printReceipt(any(Order.class));
        verify(lineService, times(1)).notifyOrderStatusChange(any(Order.class));
    }

    @Test
    @DisplayName("商品完售時應該拋出異常")
    void shouldThrowExceptionWhenProductUnavailable() {
        // Arrange
        Product product = Product.builder()
                .id(1L)
                .name("已售完商品")
                .available(false)
                .build();

        // OrderRequest(tableNumber, type, items)
        CartItemRequest itemRequest = new CartItemRequest(1L, 1, null);
        OrderRequest orderRequest = new OrderRequest(null, "TAKEAWAY", List.of(itemRequest), null);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> orderService.placeOrder(orderRequest));

        assertTrue(exception.getMessage().contains("Product is not available"));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("商品不存在時應該拋出異常")
    void shouldThrowExceptionWhenProductNotFound() {
        // Arrange
        // OrderRequest(tableNumber, type, items)
        CartItemRequest itemRequest = new CartItemRequest(999L, 1, null);
        OrderRequest orderRequest = new OrderRequest(null, "TAKEAWAY", List.of(itemRequest), null);

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> orderService.placeOrder(orderRequest));
    }
}
