package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchRepo extends JpaRepository<Watch, UUID>, JpaSpecificationExecutor<Watch> {


    @Query("SELECT w FROM Watch  w where w.watchID = :watchID")
    Optional<Watch> findByWatchID(@Param("watchID") UUID watchID);

    Optional<Watch> findByBrandAndModelAndMechanismAndColor(@NotBlank String brand, @NotBlank String model, @NotBlank String mechanism, @NotBlank String color);

    long countByStockLessThan(int threshold);

    @Query("SELECT DISTINCT w.brand FROM Watch w WHERE w.brand IS NOT NULL ORDER BY w.brand")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT w.color FROM Watch w WHERE w.color IS NOT NULL ORDER BY w.color")
    List<String> findDistinctColors();

    @Query("SELECT DISTINCT w.mechanism FROM Watch w WHERE w.mechanism IS NOT NULL ORDER BY w.mechanism")
    List<String> findDistinctMechanisms();

    @Query("SELECT DISTINCT w.gender FROM Watch w WHERE w.gender IS NOT NULL")
    List<GenderType> findDistinctGenders();

    @Query("SELECT DISTINCT w.occasion FROM Watch w WHERE w.occasion IS NOT NULL")
    List<OccasionType> findDistinctOccasions();

    @Query("SELECT MIN(w.price) FROM Watch w")
    Float findMinPrice();

    @Query("SELECT MAX(w.price) FROM Watch w")
    Float findMaxPrice();

    @Query("SELECT w.watchID, w.brand, w.model, w.discountPercentage, w.saleEndDate FROM Watch w " +
            "WHERE w.discountPercentage IS NOT NULL " +
            "AND w.saleStartDate <= CURRENT_DATE " +
            "AND w.saleEndDate >= CURRENT_DATE " +
            "AND w.isActive = true AND w.stock > 0 " +
            "ORDER BY w.discountPercentage DESC")
    List<Object[]> findActiveSales(Pageable pageable);

}

