package com.invictus.watches_final.dto.CartDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {

    private UUID userID;

    private List<CartItemDTO> cartItems;
}

