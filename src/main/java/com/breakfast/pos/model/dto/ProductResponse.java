package com.breakfast.pos.model.dto;

import java.math.BigDecimal;

/**
 * Product Response DTO (使用 Java 21 Record)
 * 用於 API 回傳，避免直接暴露 Entity
 */
public record ProductResponse(
        Long id,
        String name,
        BigDecimal price,
        String description,
        String categoryName,
        Boolean available) {
}
