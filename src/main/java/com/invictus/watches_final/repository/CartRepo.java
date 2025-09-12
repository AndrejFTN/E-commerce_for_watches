package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Cart;
import com.invictus.watches_final.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepo extends JpaRepository<Cart, UUID> {

    Optional<Cart> findByUser(User user);
}
