package com.invictus.watches_final.dto.WatchDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterOptionsDTO {
    private List<String> brands;
    private List<String> colors;
    private List<String> mechanisms;
    private List<String> genders;
    private List<String> occasions;
    private Float minPrice;
    private Float maxPrice;
}
