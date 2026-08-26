package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.OrderDTOs.CreateOrderDTO;
import com.invictus.watches_final.dto.OrderDTOs.OrderDTO;
import com.invictus.watches_final.dto.OrderDTOs.OrderItemDTO;
import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static Order dtoToEntity(CreateOrderDTO createOrderDTO) {
        Order order = new Order();

        order.setMail(createOrderDTO.getMail());
        order.setAddress(createOrderDTO.getAddress());
        order.setZipCode(createOrderDTO.getZipCode());
        order.setPhoneNumber(createOrderDTO.getPhoneNumber());

        return order;
    }

    public static OrderDTO entityToDTO(Order order) {
        OrderDTO dto = new OrderDTO();

        dto.setAddress(order.getAddress());
        dto.setZipCode(order.getZipCode());
        dto.setMail(order.getMail());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setDateOfOrder(order.getDateOfOrder());
        dto.setStatus(order.getStatus());
        dto.setOrderID(order.getOrderID());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingCost(order.getShippingCost());
        dto.setUserName(order.getUser().getUserName());
        dto.setGrandTotal(order.getTotalAmount() + order.getShippingCost());

        List<OrderItemDTO> items = order.getOrderItems()
                .stream()
                .map(OrderItemMapper::entityToDTO)
                .collect(Collectors.toList());

        dto.setOrderItems(items);
        return dto;
    }
}
