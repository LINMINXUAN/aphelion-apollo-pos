package com.breakfast.pos.mapper;

import com.breakfast.pos.model.dto.CategoryResponse;
import com.breakfast.pos.model.entity.Category;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * MapStruct Mapper for Category Entity <-> DTO
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category entity);

    List<CategoryResponse> toResponseList(List<Category> entities);
}
