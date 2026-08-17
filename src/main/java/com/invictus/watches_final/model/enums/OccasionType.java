package com.invictus.watches_final.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OccasionType {
    SPORTSKI,
    ELEGANTNI,
    SVAKODNEVNI,
    POSLOVNI;

    @JsonCreator
    public static OccasionType fromString(String value) {
        return switch(value.toLowerCase()){
            case "sportski" -> SPORTSKI;
            case "elegantni" -> ELEGANTNI;
            case "svakodnevni" -> SVAKODNEVNI;
            case "poslovni" -> POSLOVNI;
            default -> throw new IllegalArgumentException("Wrong value for occasion: " + value);
        };
    }

    @JsonValue
    public String toValue(){
        return this.name().toLowerCase();
    }
}
