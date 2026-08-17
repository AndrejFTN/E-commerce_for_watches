package com.invictus.watches_final.model;

import com.invictus.watches_final.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue
    private UUID orderID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userID", nullable = false)
    private User user;


    private LocalDateTime dateOfOrder;
    private String phoneNumber;
    private OrderStatus status = OrderStatus.PENDING; //mozda u servisu odraditi
    private String address;
    private String zipCode;
    private String mail;

    private double totalAmount;
    private double shippingCost;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private String stripeSessionId;


}
