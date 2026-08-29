package com.invictus.watches_final.model;

import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Watch {


    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID watchID;

    @OneToMany(mappedBy = "watch")
    private List<CartItem> cartItems;

    private String model;
    private String brand;
    private String color;
    private String mechanism;
    private LocalDate manufactureDate;
    private float price;
    private Integer stock;
    private boolean isActive;

    @OneToMany(mappedBy = "watch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WatchImage> images = new ArrayList<>();

    @Version
    private Long version;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OccasionType occasion;

    @Enumerated(EnumType.STRING)
    private GenderType gender;

    public static final int NEW_FOR_DAYS = 10;
    private LocalDateTime createdAt;
    @Column(length = 2000)
    private String description;

    private Integer discountPercentage;
    private LocalDate saleStartDate;
    private LocalDate saleEndDate;

    public boolean isOnSale(){
        if(discountPercentage == null || saleStartDate == null || saleEndDate == null){
            return false;
        }

        LocalDate today = LocalDate.now();
        return !today.isBefore(saleStartDate) && !today.isAfter(saleEndDate);
    }

    public float getEffectivePrice(){
        return isOnSale() ? price * (1 - discountPercentage / 100f) : price;
    }

    public boolean isNewArrival() {
        return createdAt != null
                && createdAt.isAfter(LocalDateTime.now().minusDays(NEW_FOR_DAYS));
    }
}
