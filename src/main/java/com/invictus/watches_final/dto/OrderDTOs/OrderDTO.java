package com.invictus.watches_final.dto.OrderDTOs;

import com.invictus.watches_final.model.enums.OrderStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private UUID orderID;
    private String address;
    private String zipCode;
    private String mail;
    private LocalDateTime dateOfOrder;
    private String phoneNumber;
    private OrderStatus status;
    private List<OrderItemDTO> orderItems;
    private double totalAmount;
    private double shippingCost;
    private double grandTotal;
    private String userName;
}
