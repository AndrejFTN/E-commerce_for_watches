package com.invictus.watches_final.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue
    private UUID cartItemID;

    private int amount;
    private float price;

    @ManyToOne
    @JoinColumn(name = "watchID")
    private Watch watch;

    @ManyToOne
    @JoinColumn(name= "cartID")
    private Cart cart;
}
