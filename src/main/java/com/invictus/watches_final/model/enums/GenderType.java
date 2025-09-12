package com.invictus.watches_final.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GenderType {
    MUSKI,
    ZENSKI,
    UNISEX;

    @JsonCreator
    public static GenderType fromString(String value) {
        return switch (value.toLowerCase()) {
            case "muski" -> MUSKI;
            case "zenski" -> ZENSKI;
            case "unisex" -> UNISEX;
            default -> throw new IllegalArgumentException("Wrong value for gender: " + value);
        };
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
