package com.breakfast.pos.controller;

import com.breakfast.pos.common.ApiResponse;
import com.breakfast.pos.model.dto.OrderRequest;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/**
 * 訂單 API 控制器
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> checkout(@Valid @RequestBody OrderRequest request) {
        OrderResponse completedOrder = orderService.placeOrder(request);
        return ApiResponse.success(completedOrder);
    }
}
