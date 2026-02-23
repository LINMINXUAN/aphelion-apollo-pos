package com.breakfast.pos.controller;

import com.breakfast.pos.model.dto.ProductRequest;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.security.JwtTokenProvider;
import com.breakfast.pos.service.MenuService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MenuService menuService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @Test
    @DisplayName("未認證存取 Admin API 應回傳 403")
    void shouldReturn403WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("STAFF 角色存取 Admin API 應回傳 403")
    @WithMockUser(roles = "STAFF")
    void shouldReturn403ForStaffRole() throws Exception {
        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ADMIN 角色應能成功建立商品")
    @WithMockUser(roles = "ADMIN")
    void shouldCreateProductWithAdminRole() throws Exception {
        var request = new ProductRequest("新商品", new BigDecimal("50"), "描述", 1L, true);
        var response = new ProductResponse(1L, "新商品", new BigDecimal("50"), "描述", "漢堡", true);

        when(menuService.createProduct(any())).thenReturn(response);

        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("新商品"));
    }

    @Test
    @DisplayName("建立商品缺少必填欄位應回傳 400")
    @WithMockUser(roles = "ADMIN")
    void shouldReturn400ForInvalidProductRequest() throws Exception {
        var invalidRequest = new ProductRequest("", null, null, null, true);

        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
