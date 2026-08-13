package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.OrderDTOs.OrderItemDTO;
import com.invictus.watches_final.model.OrderItem;

public class OrderItemMapper {

    public static OrderItemDTO entityToDTO(OrderItem orderItem){
        OrderItemDTO dto = new OrderItemDTO();

        dto.setPrice(orderItem.getPrice());
        dto.setAmount(orderItem.getAmount());
        dto.setModel(orderItem.getWatch().getModel());
        dto.setColor(orderItem.getWatch().getColor());
        dto.setMechanism(orderItem.getWatch().getMechanism());
        dto.setBrand(orderItem.getWatch().getBrand());
        dto.setWatchID(orderItem.getWatch().getWatchID());

        return dto;
    }
}
