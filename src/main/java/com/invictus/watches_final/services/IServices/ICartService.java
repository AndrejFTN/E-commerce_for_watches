package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.dto.CartDTOs.CartDTO;
import com.invictus.watches_final.dto.CartDTOs.CartItemDTO;
import com.invictus.watches_final.dto.CartDTOs.CreateCartItemDTO;

import java.util.UUID;

public interface ICartService {

    CartDTO getCart(UUID userID);

    CartItemDTO addItemToCart(UUID userID, CreateCartItemDTO createCartItemDTO);

    boolean deleteItem(UUID cartItemID, UUID userID);

    boolean emptyCart(UUID userID);

    CartItemDTO updateItemAmount(UUID userID, UUID cartItemID, int amount);



}
