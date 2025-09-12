package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Watch;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchRepo extends JpaRepository<Watch, UUID> {


    @Query("SELECT w FROM Watch w " +
            "WHERE (:color IS NULL OR w.color LIKE :color) " +
            "AND (:brand IS NULL OR w.brand LIKE :brand) " +
            "AND (:mechanism IS NULL OR w.mechanism LIKE :mechanism) "+
            "AND (:minPrice IS NULL OR w.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR w.price <= :maxPrice) ")
    Page<Watch> filteredWatches(@Param("color") String color,
                                @Param("brand") String brand,
                                @Param("mechanism") String mechanism,
                                @Param("minPrice") Float minPrice,
                                @Param("maxPrice") Float maxPrice,
                                Pageable pageable);




    //Uradjena paginacija sa ugradjenom metodom u JPA

    boolean existsByBrandAndModelAndMechanism(String brand, String model, String mechanism);

    @Query("SELECT w FROM Watch  w where w.watchID = :watchID")
    Optional<Watch> findByWatchID(@Param("watchID") UUID watchID); // moze i bez


//    Optional<Watch> findByBrandAndModelAndMechanism(String brand, String model, String mechanism);

    Optional<Watch> findByBrandAndModelAndMechanismAndColor(@NotBlank String brand, @NotBlank String model, @NotBlank String mechanism, @NotBlank String color);
}

