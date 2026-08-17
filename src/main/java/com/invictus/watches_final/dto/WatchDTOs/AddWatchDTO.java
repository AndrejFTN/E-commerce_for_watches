package com.invictus.watches_final.dto.WatchDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddWatchDTO {

    @NotBlank
    private String model;
    @NotBlank
    private String brand;
    @NotBlank
    private String color;
    @NotBlank
    private String mechanism; //moguceo draditi drop meni
    @NotNull
    @PastOrPresent(message = "Manufacture date cannot be in the future, date must be in yyyy-MM-dd format")
    private LocalDate manufactureDate;
    @NotNull
    @Min(value = 0, message = "Price can't be negative")
    private float price;
    @NotNull
    @Min(value = 0, message = "Number can't be negative")
    private Integer stock;
    @NotNull(message = "Gender is required.")
    private GenderType gender;
    @NotNull(message = "Occasion is required.")
    private OccasionType occasion;

    @Min(value = 5, message = "Discount must be at least 5%")
    @Max(value = 90, message = "Discount cannot exceed 90%")
    private Integer discountPercentage;

    private LocalDate saleStartDate;
    private LocalDate saleEndDate;
}
