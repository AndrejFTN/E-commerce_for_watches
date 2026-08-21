package com.invictus.watches_final.infrastructure;

import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class WatchSpecifications {

    public static Specification<Watch> hasColor(List<String> colors){
        return(root, query, cb) -> (colors == null || colors.isEmpty()) ? null
                : root.get("color").in(colors);
    }

    public static Specification<Watch> hasBrand(List<String> brands){
        return (root, query, cb) -> (brands == null || brands.isEmpty()) ? null
                : root.get("brand").in(brands);
    }

    public static Specification<Watch> hasMechanism(List<String> mechanisms){
        return (root, query, cb) -> (mechanisms == null || mechanisms.isEmpty()) ? null
                : root.get("mechanism").in(mechanisms);
    }

    public static Specification<Watch> hasOccasion(List<OccasionType>  occasions){
        return (root, query, cb) -> (occasions == null || occasions.isEmpty()) ? null
                : root.get("occasion").in(occasions);
    }

    public static Specification<Watch> hasGender(List<GenderType> genders){
        return (root, query, cb) -> (genders == null || genders.isEmpty()) ? null
                : root.get("gender").in(genders);
    }

    public static Specification<Watch> priceBetween(Float minPrice, Float maxPrice){
        return (root, query, cb) -> {
            if(minPrice == null && maxPrice == null){
                return null;
            }
            if(minPrice != null && maxPrice != null){
                return cb.between(root.get("price"), minPrice, maxPrice);
            }
            if(minPrice != null){
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
    public static Specification<Watch> searchTerm(String searchTerm){
        return (root, query, cb) -> {
            if(searchTerm == null) {
                return null;
            }
            String pattern = "%" + searchTerm.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("brand")), pattern),
                    cb.like(cb.lower(root.get("model")), pattern)
            );
        };

    }

}
