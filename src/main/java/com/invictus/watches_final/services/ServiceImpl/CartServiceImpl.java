package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.CartDTOs.CartDTO;
import com.invictus.watches_final.dto.CartDTOs.CartItemDTO;
import com.invictus.watches_final.dto.CartDTOs.CreateCartItemDTO;
import com.invictus.watches_final.mapper.CartItemMapper;
import com.invictus.watches_final.mapper.CartMapper;
import com.invictus.watches_final.model.Cart;
import com.invictus.watches_final.model.CartItem;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.repository.CartItemRepo;
import com.invictus.watches_final.repository.CartRepo;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.repository.WatchRepo;
import com.invictus.watches_final.services.IServices.ICartService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CartServiceImpl implements ICartService {

    private final CartRepo cartRepo;
    private final UserRepo userRepo;
    private final WatchRepo watchRepo;
    private final CartItemRepo cartItemRepo;

    @Override
    public CartDTO getCart(UUID userID) { //mozda greska

        User user = userRepo.findById(userID)
                .orElseThrow(()-> new EntityNotFoundException("User not found ID:" +  userID));

        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(()-> new EntityNotFoundException("Cart not found with userID:" +  userID));//mozda greska


        List<CartItem> cartItems = cartItemRepo.findByCart(cart);
        cart.setItems(cartItems);

        return CartMapper.entityToDTO(cart);
    }

    @Transactional
    @Override
    public CartItemDTO addItemToCart(UUID userID, CreateCartItemDTO createCartItemDTO) {
        var user = userRepo.findById(userID)
                .orElseThrow(()-> new EntityNotFoundException("User not found ID:" +  userID));

        var cart =  cartRepo.findByUser(user)
                .orElseThrow(()-> new EntityNotFoundException("Cart not found ID:" +  userID));

        var watch = watchRepo.findByWatchID(createCartItemDTO.getWatchID())
                .orElseThrow(() -> new EntityNotFoundException("Watch not found ID: " + createCartItemDTO.getWatchID()));


        Optional<CartItem> existingItem = cartItemRepo.findByCartAndWatch(cart, watch);

        int currentAmountInCart = existingItem.map(CartItem::getAmount).orElse(0);
        int totalRequested =  currentAmountInCart + createCartItemDTO.getAmount();

        if(totalRequested > watch.getStock()){
            throw new IllegalArgumentException(
                    "Not enough stock for watch: " + watch.getBrand() + " " + watch.getModel() +
                            " (available: " + watch.getStock() + ", already in cart: " + currentAmountInCart +
                            ", requested: " + createCartItemDTO.getAmount() + ")"
            );
        }

        CartItem cartItem = existingItem
                .map(existing -> {
                    existing.setAmount(totalRequested);
                    return cartItemRepo.save(existing);
                }).orElseGet(()-> {
                    CartItem newCartItem = new CartItem();
                    newCartItem.setCart(cart);
                    newCartItem.setWatch(watch);
                    newCartItem.setAmount(createCartItemDTO.getAmount());
                    newCartItem.setPrice(watch.getPrice());
                    return cartItemRepo.save(newCartItem);
                });

        return CartItemMapper.entityToItemDTO(cartItem);

//        CartItem cartItem = cartItemRepo.findByCartAndWatch(cart, watch)
//                .map(existing ->{
//
//                    existing.setAmount(existing.getAmount() + createCartItemDTO.getAmount());
//
//                    return cartItemRepo.save(existing);
//                }).orElseGet(()->{
//                    CartItem newCartItem = new CartItem();
//
//                    newCartItem.setCart(cart);
//                    newCartItem.setWatch(watch);
//                    newCartItem.setAmount(createCartItemDTO.getAmount());
//                    newCartItem.setPrice(watch.getPrice());
//
//                    return cartItemRepo.save(newCartItem);
//                });
    }

    @Transactional
    @Override
    public boolean deleteItem(UUID userID, UUID cartItemID) {

        Cart cart = cartRepo.findByUser(userRepo.findById(userID)
                        .orElseThrow(() -> new EntityNotFoundException("User not found ID: " + userID)))
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for user ID: " + userID));

        CartItem cartItem = cartItemRepo.findById(cartItemID)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found ID: " + cartItemID));

        if (!cartItem.getCart().equals(cart)) {
            throw new EntityNotFoundException("Cart item does not belong to this user");
        }

        cartItemRepo.delete(cartItem);
        return true;
    }

    @Transactional
    @Override
    public boolean emptyCart(UUID userID) {

        User user = userRepo.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found ID: " + userID));

        Cart cart = cartRepo.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for user ID: " + userID));

        List<CartItem> cartItems = cartItemRepo.findByCart(cart);

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is already empty");
        }

        cartItemRepo.deleteAll(cartItems);

        return true;
    }
}
