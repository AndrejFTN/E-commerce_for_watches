package com.invictus.watches_final.dto.FavoriteDTOs;

import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDTO {

    private UUID favoriteID;
    private UUID watchID;

    private String model;
    private String brand;
    private String color;
    private String mechanism;
    private float price;
    private GenderType gender;

    private Integer stock;
    private boolean isActive;

    private OccasionType occasion;
    private Integer discountPercentage;
    private boolean onSale;
    private float effectivePrice;

    private LocalDateTime dateAdded;
}
