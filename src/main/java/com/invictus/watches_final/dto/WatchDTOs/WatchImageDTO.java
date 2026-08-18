package com.invictus.watches_final.dto.WatchDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WatchImageDTO {
    private UUID imageID;
    private String image;
    private boolean isPrimary;
}
