package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Cart;
import com.invictus.watches_final.model.CartItem;
import com.invictus.watches_final.model.Watch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, UUID> {

    Optional<CartItem> findByCartAndWatch(Cart cart, Watch watch);

    List<CartItem> findByCart(Cart cart);

    boolean existsByWatch(Watch watch);

}
