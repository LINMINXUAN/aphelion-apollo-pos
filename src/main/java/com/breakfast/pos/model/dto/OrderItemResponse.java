package com.breakfast.pos.model.dto;

import java.math.BigDecimal;

/**
 * OrderItem Response DTO
 */
public record OrderItemResponse(
        Long id,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        String modifiers,
        BigDecimal subtotal) {
}
