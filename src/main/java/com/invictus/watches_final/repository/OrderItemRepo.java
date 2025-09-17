package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, UUID> {

    @Query("SELECT o FROM OrderItem o WHERE o.order.orderID = :orderID")
    List<OrderItem> findByOrderID(@Param("orderID") UUID orderID);
}
