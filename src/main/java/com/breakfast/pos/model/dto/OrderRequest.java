package com.breakfast.pos.model.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

/**
 * 點餐請求 Record
 */
public record OrderRequest(
        String tableNumber,

        @NotBlank(message = "訂單類型不能為空 (DINE_IN/TAKEAWAY)") String type,

        @NotEmpty(message = "訂單必須包含至少一項商品") @Valid List<CartItemRequest> items,

        String idempotencyKey) {
}
