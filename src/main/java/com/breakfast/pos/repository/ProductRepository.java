package com.breakfast.pos.repository;

import com.breakfast.pos.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(String name);
    long countByAvailableFalse();
}
