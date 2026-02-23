package com.breakfast.pos.model.dto;

/**
 * Category Response DTO
 */
public record CategoryResponse(
        Long id,
        String name,
        Integer displayOrder) {
}
