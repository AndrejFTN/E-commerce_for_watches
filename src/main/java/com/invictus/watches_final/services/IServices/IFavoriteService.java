package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.dto.FavoriteDTOs.FavoriteDTO;
import com.invictus.watches_final.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IFavoriteService {

    FavoriteDTO addFavorite(UUID watchID);

    void removeFavorite(UUID watchID);

    Page<FavoriteDTO> getMyFavorites(Pageable pageable);
}
