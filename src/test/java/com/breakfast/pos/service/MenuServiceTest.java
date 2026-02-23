package com.breakfast.pos.service;

import com.breakfast.pos.exception.ResourceNotFoundException;
import com.breakfast.pos.mapper.CategoryMapper;
import com.breakfast.pos.mapper.ProductMapper;
import com.breakfast.pos.model.dto.ProductRequest;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.model.entity.Category;
import com.breakfast.pos.model.entity.Product;
import com.breakfast.pos.repository.CategoryRepository;
import com.breakfast.pos.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private MenuService menuService;

    @Test
    @DisplayName("應該成功創建商品")
    void shouldCreateProductSuccessfully() {
        // Arrange
        var request = new ProductRequest("起司蛋堡", new BigDecimal("45"), "好吃", 1L, true);
        var category = Category.builder().id(1L).name("漢堡").build();
        var product = Product.builder().id(10L).name("起司蛋堡").price(new BigDecimal("45")).category(category)
                .available(true).build();
        var expectedResponse = new ProductResponse(10L, "起司蛋堡", new BigDecimal("45"), "好吃", "漢堡", true);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toResponse(any(Product.class))).thenReturn(expectedResponse);

        // Act
        ProductResponse result = menuService.createProduct(request);

        // Assert
        assertNotNull(result);
        assertEquals("起司蛋堡", result.name());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("當分類不存在時創建商品應該拋出異常")
    void shouldThrowExceptionWhenCategoryNotFound() {
        // Arrange
        var request = new ProductRequest("起司蛋堡", new BigDecimal("45"), "好吃", 99L, true);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> menuService.createProduct(request));
    }

    @Test
    @DisplayName("應該成功更新商品")
    void shouldUpdateProductSuccessfully() {
        // Arrange
        Long productId = 1L;
        var request = new ProductRequest("新蛋堡", new BigDecimal("50"), "更好吃", 1L, false);
        var category = Category.builder().id(1L).name("漢堡").build();
        var existingProduct = Product.builder().id(productId).name("舊蛋堡").price(new BigDecimal("45")).category(category)
                .build();
        var updatedProduct = Product.builder().id(productId).name("新蛋堡").price(new BigDecimal("50")).category(category)
                .available(false).build();
        var expectedResponse = new ProductResponse(productId, "新蛋堡", new BigDecimal("50"), "更好吃", "漢堡", false);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        when(productMapper.toResponse(any(Product.class))).thenReturn(expectedResponse);

        // Act
        ProductResponse result = menuService.updateProduct(productId, request);

        // Assert
        assertNotNull(result);
        assertEquals("新蛋堡", result.name());
        assertFalse(result.available());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("更新不存在的商品應該拋出異常")
    void shouldThrowExceptionWhenUpdatingNonExistentProduct() {
        // Arrange
        Long productId = 99L;
        var request = new ProductRequest("新蛋堡", new BigDecimal("50"), "更好吃", 1L, false);
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> menuService.updateProduct(productId, request));
    }

    @Test
    @DisplayName("應該成功切換商品可售狀態")
    void shouldToggleAvailability() {
        // Arrange
        var product = Product.builder().id(1L).available(true).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        menuService.toggleAvailability(1L);

        // Assert
        assertFalse(product.isAvailable());
        verify(productRepository, times(1)).save(product);
    }
}
