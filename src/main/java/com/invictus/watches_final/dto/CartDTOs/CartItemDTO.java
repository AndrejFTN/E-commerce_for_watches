package com.invictus.watches_final.dto.CartDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.parameters.P;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {

    private UUID cartItemID;
    private UUID watchID;

    @NotNull
    @Positive
    private int amount;
    @NotNull
    @Positive
    private float price;

    private String model;
    private String brand;
    private String color;
    private GenderType gender;

    //dodavanje moguce akcijskih cena
}
