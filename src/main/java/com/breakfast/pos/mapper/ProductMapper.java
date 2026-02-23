package com.breakfast.pos.mapper;

import com.breakfast.pos.model.dto.ProductResponse;
import com.breakfast.pos.model.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct Mapper for Product Entity <-> DTO
 * componentModel = "spring" 讓 MapStruct 自動生成 @Component
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toResponse(Product entity);

    List<ProductResponse> toResponseList(List<Product> entities);
}
