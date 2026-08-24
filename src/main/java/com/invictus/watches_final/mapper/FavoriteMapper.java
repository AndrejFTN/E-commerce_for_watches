package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.FavoriteDTOs.FavoriteDTO;
import com.invictus.watches_final.model.Favorite;

public class FavoriteMapper {

    public static FavoriteDTO entityToDTO(Favorite favorite){
        FavoriteDTO dto = new FavoriteDTO();

        dto.setFavoriteID(favorite.getFavoriteID());
        dto.setWatchID(favorite.getWatch().getWatchID());
        dto.setModel(favorite.getWatch().getModel());
        dto.setBrand(favorite.getWatch().getBrand());
        dto.setColor(favorite.getWatch().getColor());
        dto.setMechanism(favorite.getWatch().getMechanism());
        dto.setPrice(favorite.getWatch().getPrice());
        dto.setGender(favorite.getWatch().getGender());
        dto.setStock(favorite.getWatch().getStock());
        dto.setActive(favorite.getWatch().isActive());
        dto.setDateAdded(favorite.getDateAdded());

        return dto;
    }
}
