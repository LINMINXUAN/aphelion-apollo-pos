package com.breakfast.pos.model.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Long id,
        String name,
        BigDecimal price,
        String description,
        String categoryName,
        boolean available) {
}
