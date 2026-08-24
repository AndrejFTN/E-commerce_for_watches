package com.invictus.watches_final.dto.WatchDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WatchDTO {

    private String model;
    private String color;
    private String brand;
    private LocalDate manufactureDate;
    private String mechanism;
    private float price;
    private Integer stock;
    private GenderType gender;
    private OccasionType occasion;
    private boolean isActive;
    private UUID watchID;
    private List<WatchImageDTO> images;

    private Integer discountPercentage;
    private LocalDate saleStartDate;
    private LocalDate saleEndDate;
    private boolean onSale;
    private float effectivePrice;

    private String description;
    private boolean newArrival;

}
