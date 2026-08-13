package com.invictus.watches_final.dto.WatchDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
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
}
