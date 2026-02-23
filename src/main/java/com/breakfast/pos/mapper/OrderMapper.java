package com.breakfast.pos.mapper;

import com.breakfast.pos.model.dto.OrderItemResponse;
import com.breakfast.pos.model.dto.OrderResponse;
import com.breakfast.pos.model.entity.Order;
import com.breakfast.pos.model.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct Mapper for Order Entity <-> DTO
 * uses = {OrderItemMapper.class} 表示使用 OrderItemMapper 進行嵌套轉換
 */
@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    @Mapping(target = "type", expression = "java(entity.getType().name())")
    OrderResponse toResponse(Order entity);

    @Mapping(source = "product.name", target = "productName")
    OrderItemResponse toItemResponse(OrderItem entity);
}
