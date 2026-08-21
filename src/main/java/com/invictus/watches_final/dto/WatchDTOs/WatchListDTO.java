package com.invictus.watches_final.dto.WatchDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WatchListDTO {

    private UUID watchID;
    private String brand;
    private String model;
    private String color;
    private String mechanism;
    private LocalDate manufactureDate;
    private Integer stock;
    private boolean isActive;
    private GenderType gender;
    private OccasionType occasion;

    private float price;
    private float effectivePrice;
    private boolean onSale;
    private Integer discountPercentage;

    private UUID primaryImageID;
}
