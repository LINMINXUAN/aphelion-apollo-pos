package com.breakfast.pos.controller;

import com.breakfast.pos.common.ApiResponse;
import com.breakfast.pos.model.dto.ProductRequest;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 後台管理 API - 商品維護
 */
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final MenuService menuService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.success(menuService.getAllProducts());
    }

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(menuService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(menuService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ApiResponse<Void> toggleAvailability(@PathVariable Long id) {
        menuService.toggleAvailability(id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        menuService.deleteProduct(id);
        return ApiResponse.success(null);
    }
}
