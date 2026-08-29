package com.invictus.watches_final.dto.CartDTOs;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCartItemDTO {

    private UUID watchID;

    @NotNull
    @Positive
    private int amount;
}
