package com.invictus.watches_final.dto.WatchDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActiveSaleDTO {
    private UUID watchID;
    private String brand;
    private String model;
    private Integer discountPercentage;
    private LocalDate endDate;
}