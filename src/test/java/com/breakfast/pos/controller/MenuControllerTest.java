package com.breakfast.pos.controller;

import com.breakfast.pos.model.dto.CategoryResponse;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.service.MenuService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MenuService menuService;

    @Test
    @DisplayName("GET /api/menu/products 應回傳所有商品")
    void shouldReturnAllProducts() throws Exception {
        var products = List.of(
                new ProductResponse(1L, "起司蛋堡", new BigDecimal("45.00"), "好吃", "漢堡", true),
                new ProductResponse(2L, "大冰奶", new BigDecimal("25.00"), null, "飲料", true));
        when(menuService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/menu/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].name").value("起司蛋堡"));
    }

    @Test
    @DisplayName("GET /api/menu/categories 應回傳所有分類")
    void shouldReturnAllCategories() throws Exception {
        var categories = List.of(
                new CategoryResponse(1L, "漢堡", 0),
                new CategoryResponse(2L, "飲料", 1));
        when(menuService.getAllCategories()).thenReturn(categories);

        mockMvc.perform(get("/api/menu/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    @DisplayName("GET /api/menu/products/{id} 存在時應回傳商品")
    void shouldReturnProductById() throws Exception {
        var product = new ProductResponse(1L, "起司蛋堡", new BigDecimal("45.00"), "好吃", "漢堡", true);
        when(menuService.getProductById(1L)).thenReturn(Optional.of(product));

        mockMvc.perform(get("/api/menu/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("起司蛋堡"));
    }

    @Test
    @DisplayName("GET /api/menu/products/{id} 不存在時應回傳錯誤")
    void shouldReturnErrorWhenProductNotFound() throws Exception {
        when(menuService.getProductById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/menu/products/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }
}
