package com.breakfast.pos.controller;

import com.breakfast.pos.common.ApiResponse;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ApiResponse<List<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(adminOrderService.getAllOrders(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long id) {
        return ApiResponse.success(adminOrderService.getOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ApiResponse.success(adminOrderService.updateOrderStatus(id, request.status()));
    }

    public record StatusUpdateRequest(String status) {}
}
