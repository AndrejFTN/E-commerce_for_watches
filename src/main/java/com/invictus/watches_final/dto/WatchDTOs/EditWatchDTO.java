package com.invictus.watches_final.dto.WatchDTOs;


import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EditWatchDTO {

    private UUID watchID;
    @NotBlank
    private String model;
    @NotBlank
    private String color;
    @NotBlank
    private String brand;
    @NotNull
    private LocalDate manufactureDate;
    @NotBlank
    private String mechanism;
    @NotNull
    @Positive
    private float price;
    @NotNull
    @Min(value = 0, message = "Number can't be negative")
    private Integer stock;
    @NotNull
    private GenderType gender;
    @NotNull
    private OccasionType occasion;

    @Min(value = 5, message = "Discount must be at least 5%")
    @Max(value = 90, message = "Discount cannot exceed 90%")
    private Integer discountPercentage;

    @Size(max = 2000, message = "Opis može imati najviše 2000 karaktera")
    private String description;

    private LocalDate saleStartDate;
    private LocalDate saleEndDate;
}
