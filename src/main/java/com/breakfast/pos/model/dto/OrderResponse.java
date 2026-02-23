package com.breakfast.pos.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Response DTO
 */
public record OrderResponse(
        Long id,
        String status,
        String type,
        String tableNumber,
        BigDecimal totalAmount,
        LocalDateTime createdAt,
        List<OrderItemResponse> items) {
}
