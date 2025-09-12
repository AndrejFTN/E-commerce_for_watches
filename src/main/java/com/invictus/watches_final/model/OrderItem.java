package com.invictus.watches_final.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue
    private UUID orderItemID;

    private int amount;
    private float price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watchID", nullable = false)
    private Watch watch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderID", nullable = false)
    private Order order;
}
