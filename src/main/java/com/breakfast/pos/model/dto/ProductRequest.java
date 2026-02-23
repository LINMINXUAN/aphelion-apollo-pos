package com.breakfast.pos.model.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * 用於新增或修改商品的請求 Record
 */
public record ProductRequest(
        @NotBlank(message = "商品名稱不能為空") String name,

        @NotNull(message = "價格不能為空") @PositiveOrZero(message = "價格必須大於或等於 0") BigDecimal price,

        String description,

        @NotNull(message = "分類 ID 不能為空") Long categoryId,

        boolean available) {
}
