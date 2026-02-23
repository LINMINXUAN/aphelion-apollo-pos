package com.breakfast.pos.controller;

import com.breakfast.pos.common.ApiResponse;
import com.breakfast.pos.model.dto.CategoryResponse;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/products")
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.success(menuService.getAllProducts());
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.success(menuService.getAllCategories());
    }

    @GetMapping("/products/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        return menuService.getProductById(id)
                .map(ApiResponse::success)
                .orElseGet(() -> ApiResponse.error("Product not found with id: " + id));
    }
}
