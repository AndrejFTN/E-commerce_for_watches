package com.invictus.watches_final.dto.OrderDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

    private UUID watchID;

    private int amount;
    private float price;

    private String model;
    private String color;
    private String brand;
    private String mechanism;

}
