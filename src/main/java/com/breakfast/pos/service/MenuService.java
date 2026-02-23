package com.breakfast.pos.service;

import com.breakfast.pos.exception.ResourceNotFoundException;
import com.breakfast.pos.mapper.CategoryMapper;
import com.breakfast.pos.mapper.ProductMapper;
import com.breakfast.pos.model.dto.CategoryResponse;
import com.breakfast.pos.model.dto.ProductRequest;
import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.model.entity.Category;
import com.breakfast.pos.model.entity.Product;
import com.breakfast.pos.repository.CategoryRepository;
import com.breakfast.pos.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 菜單核心業務邏輯
 * 使用 MapStruct Mapper 進行 Entity <-> DTO 轉換
 */
@Service
@RequiredArgsConstructor
public class MenuService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productMapper.toResponseList(productRepository.findAll());
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryMapper.toResponseList(categoryRepository.findAll());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        Product product = Product.builder()
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .category(category)
                .available(request.available())
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    Category category = categoryRepository.findById(request.categoryId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Category not found with id: " + request.categoryId()));

                    existingProduct.setName(request.name());
                    existingProduct.setPrice(request.price());
                    existingProduct.setDescription(request.description());
                    existingProduct.setCategory(category);
                    existingProduct.setAvailable(request.available());

                    return productMapper.toResponse(productRepository.save(existingProduct));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void toggleAvailability(Long id) {
        productRepository.findById(id).ifPresentOrElse(
                p -> {
                    p.setAvailable(!p.isAvailable());
                    productRepository.save(p);
                },
                () -> {
                    throw new ResourceNotFoundException("Product not found with id: " + id);
                });
    }

}
