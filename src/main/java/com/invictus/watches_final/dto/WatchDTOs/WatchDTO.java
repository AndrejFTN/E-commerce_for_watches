package com.invictus.watches_final.dto.WatchDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WatchDTO {


    @NotBlank
    private String model; //odraditi validaciju polja
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
    @Positive
    private Integer stock;
    @NotNull
    private GenderType gender;
    private boolean isActive;
    private UUID watchID;
    private String image; //da li string ili bytes

}
