package com.invictus.watches_final.mapper;


import com.invictus.watches_final.dto.CartDTOs.CartItemDTO;
import com.invictus.watches_final.model.CartItem;
import com.invictus.watches_final.model.WatchImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class CartItemMapper {

    public static CartItemDTO entityToItemDTO(CartItem cartItem){
        CartItemDTO cartItemDTO = new CartItemDTO();
        cartItemDTO.setCartItemID(cartItem.getCartItemID());
        cartItemDTO.setAmount(cartItem.getAmount());
        cartItemDTO.setBrand(cartItem.getWatch().getBrand());
        cartItemDTO.setColor(cartItem.getWatch().getColor());
        cartItemDTO.setModel(cartItem.getWatch().getModel());
        cartItemDTO.setPrice(cartItem.getPrice());
        cartItemDTO.setWatchID(cartItem.getWatch().getWatchID());
        cartItemDTO.setGender(cartItem.getWatch().getGender());

        cartItemDTO.setStock(cartItem.getWatch().getStock());
        cartItemDTO.setEffectivePrice(cartItem.getWatch().getEffectivePrice());
        cartItemDTO.setOnSale(cartItem.getWatch().isOnSale());

        cartItem.getWatch().getImages().stream()
                .filter(WatchImage::isPrimary)
                .findFirst()
                .ifPresent(img -> cartItemDTO.setPrimaryImageID(img.getImageID()));

        return cartItemDTO;
    }
}
