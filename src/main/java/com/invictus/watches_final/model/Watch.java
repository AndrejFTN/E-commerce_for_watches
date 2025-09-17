package com.invictus.watches_final.model;

import com.invictus.watches_final.model.enums.GenderType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Watch {


    //    @GeneratedValue(generator = "uuid2")
    //    @GenericGenerator(name = "uuid2", strategy = "uuid2")
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
    private Integer available;
    private GenderType gender;
    private boolean isActive;
    private byte[] image;
    //ubaciti mozda isAvailable kao boolean ili isActive ako ima na stanju ako nema da se ne pojavljuju.
    //ubaciti i isReserved ili isActive, proveriti ako nigde nije u korpi da se moze izbrisati
}
