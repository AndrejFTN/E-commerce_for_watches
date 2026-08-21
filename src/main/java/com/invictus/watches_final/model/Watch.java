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
    @JdbcTypeCode(SqlTypes.CHAR) // Za pretvaranje u 36char umesto 16by kako bi lakse radili upite u bazi)
    private UUID watchID;

    @OneToMany(mappedBy = "watch")
    private List<CartItem> cartItems;

    //strani kljucevi za order

    private String model;
    private String brand;
    private String color;
    private String mechanism; //moguceo draditi drop meni
    private LocalDate manufactureDate;
    private float price;
    private Integer stock; // promenjeno ima mozda greske
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

}
