package com.invictus.watches_final.dto.WatchDTOs;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AmountDTO {

    @NotNull(message = "Amount must be required")
    @Min(value = 1, message = "Amount cannot be negative")
    private Integer amount;
    private String watchID;
}
