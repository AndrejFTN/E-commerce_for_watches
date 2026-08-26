package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Order, UUID> {


    Page<Order> findByUserUserNameAndStatusOrderByDateOfOrderDesc(String username, OrderStatus status, Pageable pageable);

    List<Order> findByStatusAndDateOfOrderBefore(OrderStatus status, LocalDateTime cutoff);

    Page<Order> findByUserUserNameOrderByDateOfOrderDesc(String username, Pageable pageable);

    Optional<Order> findByOrderID(UUID orderID);

    Optional<Order> findByOrderIDAndUser(UUID orderID, User user);//mozda greska

    Page<Order> findByUserOrderByDateOfOrderDesc(User user, Pageable pageable);

    Page<Order> findByStatusAndUserOrderByDateOfOrderDesc(OrderStatus status, User user, Pageable pageable);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount + o.shippingCost), 0) FROM Order o WHERE o.status = :status")
    double getTotalRevenue(@Param("status") OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount + o.shippingCost), 0) FROM Order o WHERE o.status = :status AND o.dateOfOrder >= :start")
    double getRevenueSince(@Param("status") OrderStatus status, @Param("start") LocalDateTime start);

    long countByStatus(OrderStatus status);
}
