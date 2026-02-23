package com.breakfast.pos.config;

import com.breakfast.pos.model.entity.Category;
import com.breakfast.pos.model.entity.Product;
import com.breakfast.pos.repository.CategoryRepository;
import com.breakfast.pos.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // 使用 Record 暫存初始資料 (Java 21 style concept)
        Map<String, List<ProductInit>> rawData = Map.of(
                "漢堡", List.of(
                        new ProductInit("起司蛋堡", new BigDecimal("45")),
                        new ProductInit("卡啦雞腿堡", new BigDecimal("65"))),
                "蛋餅", List.of(
                        new ProductInit("原味蛋餅", new BigDecimal("25")),
                        new ProductInit("玉米蛋餅", new BigDecimal("35"))),
                "飲料", List.of(
                        new ProductInit("大冰奶", new BigDecimal("25")),
                        new ProductInit("研磨咖啡", new BigDecimal("45"))));

        rawData.forEach((categoryName, products) -> {
            Category category = categoryRepository.save(Category.builder().name(categoryName).build());
            List<Product> productEntities = products.stream()
                    .map(p -> Product.builder()
                            .name(p.name())
                            .price(p.price())
                            .category(category)
                            .available(true)
                            .build())
                    .collect(Collectors.toList());
            productRepository.saveAll(productEntities);
        });
    }

    record ProductInit(String name, BigDecimal price) {
    }
}
