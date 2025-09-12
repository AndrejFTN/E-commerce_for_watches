package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.CartDTOs.CartDTO;
import com.invictus.watches_final.model.Cart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CartMapper {

    public static CartDTO entityToDTO(Cart cart){
        CartDTO cartDTO = new CartDTO();

        cartDTO.setCartItems(cart.getItems().stream().map(CartItemMapper::entityToItemDTO).toList());
        cartDTO.setUserID(cart.getUser().getUserID());

        return cartDTO;
    }
}
