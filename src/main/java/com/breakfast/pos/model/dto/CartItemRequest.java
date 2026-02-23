package com.breakfast.pos.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 購物車項項請求 Record
 */
public record CartItemRequest(
        @NotNull(message = "商品 ID 不能為空") Long productId,

        @NotNull(message = "數量不能為空") @Min(value = 1, message = "數量至少為 1") Integer quantity,

        String modifiers) {
}
