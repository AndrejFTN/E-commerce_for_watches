package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {

    List<Order> findByUser(User user);

    @Query("Select o FROM Order o where o.status in :statuses order by o.dateOfOrder desc")
    List<Order> findByStatus(@Param("statuses") List<OrderStatus> status);

    @Query("Select o from Order o where o.user.userID = :userID order by o.dateOfOrder desc")
    List<Order> findByUserID(@Param("userID") UUID userID);

    @Query("Select o from Order o where o.orderID = :orderID")
    Order findByOrderID(@Param("orderID") UUID orderID);
}
