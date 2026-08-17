package com.invictus.watches_final.infrastructure;

import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import org.springframework.data.jpa.domain.Specification;

public class WatchSpecifications {

    public static Specification<Watch> hasColor(String color){
        return(root, query, cb) -> color == null ? null
                : cb.like(cb.lower(root.get("color")), "%" + color.toLowerCase() + "%");
    }

    public static Specification<Watch> hasBrand(String brand){
        return (root, query, cb) -> brand == null ? null
                : cb.like(cb.lower(root.get("brand")), "%" + brand.toLowerCase() + "%");
    }

    public static Specification<Watch> hasMechanism(String mechanism){
        return (root, query, cb) -> mechanism == null ? null
                : cb.like(cb.lower(root.get("mechanism")), "%" + mechanism.toLowerCase() + "%");
    }

    public static Specification<Watch> hasOccasion(OccasionType  occasion){
        return (root, query, cb) -> occasion == null ? null
                : cb.equal(root.get("occasion"), occasion);
    }

    public static Specification<Watch> hasGender(GenderType gender){
        return (root, query, cb) -> gender == null ? null
                : cb.equal(root.get("gender"), gender);
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
