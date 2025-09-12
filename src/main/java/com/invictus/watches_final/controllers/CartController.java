package com.invictus.watches_final.controllers;


import com.invictus.watches_final.dto.CartDTOs.CartDTO;
import com.invictus.watches_final.dto.CartDTOs.CartItemDTO;
import com.invictus.watches_final.dto.CartDTOs.CreateCartItemDTO;
import com.invictus.watches_final.security.JwtService;
import com.invictus.watches_final.services.ICartService;
import com.invictus.watches_final.services.IUserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping("/cart")
public class CartController {

    private final ICartService cartService;
    private final IUserService userService;

    private final JwtService  jwtService;


    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/getShoppingCart")
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        String username = authentication.getName();
        UUID userID = userService.getUserIDByUserName(username);
        CartDTO cartDTO = cartService.getCart(userID);
        return ResponseEntity.ok(cartDTO);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PostMapping(path = "/addItemToCart", consumes = "application/json")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody @Valid CreateCartItemDTO item,
                                                 Authentication authentication) {
        String username = authentication.getName();
        UUID userID = userService.getUserIDByUserName(username);
        CartItemDTO cartItemDTO = cartService.addItemToCart(userID, item);
        return ResponseEntity.ok(cartItemDTO);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE', 'ADMIN_ROLE')")
    @DeleteMapping(path="/deleteItemFromCart/{itemID}")
    public ResponseEntity<Boolean> deleteItemFromCart(@PathVariable UUID itemID,
                                                      Authentication authentication) {
        String username = authentication.getName();
        UUID userID = userService.getUserIDByUserName(username);

        boolean result = cartService.deleteItem(userID, itemID);

        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PostMapping(path="/emptyCart")
    public ResponseEntity<Boolean> emptyCart(Authentication authentication) {
        String username = authentication.getName();

        UUID userID = userService.getUserIDByUserName(username);

        return ResponseEntity.ok(cartService.emptyCart(userID));
    }
}
