package com.breakfast.pos.service;

import com.breakfast.pos.exception.ResourceNotFoundException;
import com.breakfast.pos.mapper.OrderMapper;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.model.entity.Order;
import com.breakfast.pos.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<OrderResponse> orders = orderRepository.findAll(pageRequest)
                .map(orderMapper::toResponse);
        return orders.getContent();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        order.setStatus(Order.OrderStatus.valueOf(status));
        return orderMapper.toResponse(orderRepository.save(order));
    }
}
