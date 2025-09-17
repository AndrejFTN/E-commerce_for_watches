package com.invictus.watches_final.dto.OrderDTOs;

import com.invictus.watches_final.model.OrderItem;
import com.invictus.watches_final.model.enums.OrderStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {


    @NotBlank(message = "Address cannot be empty")
    @Size(min = 5, message = "Address must be least 5 characters long")
    private String address;

    @NotBlank(message = "ZIP Code cannot be empty")
    @Pattern(regexp = "\\d+", message = "ZIP Code must contain only digits")
    private String zipCode;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email format is not valid")
    private String mail;

    @NotNull(message = "Date of order is required")
    private LocalDateTime dateOfOrder;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^\\+?\\d{6,15}$", message = "Phone must be digits, optionally starting with +, and 6–15 characters long")
    private String phoneNumber;

    @NotNull(message = "Status cannot be null")
    private OrderStatus status;

    @NotNull(message = "Order must contain items")
    @Size(min = 1, message = "Order must contain at least one item")
    private List<OrderItemDTO> orderItems;
}
