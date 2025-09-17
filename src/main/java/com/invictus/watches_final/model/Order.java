package com.invictus.watches_final.model;

import com.invictus.watches_final.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
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


//
//    public void addOrderItem(OrderItem item) {
//        orderItems.add(item);
//        item.setOrder(this);
//    }
//
//    public void removeOrderItem(OrderItem item) {
//        orderItems.remove(item);
//        item.setOrder(null);
//    }

}
