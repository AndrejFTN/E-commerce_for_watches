package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.FavoriteDTOs.FavoriteDTO;
import com.invictus.watches_final.mapper.FavoriteMapper;
import com.invictus.watches_final.model.Favorite;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.repository.FavoriteRepo;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.repository.WatchRepo;
import com.invictus.watches_final.services.IServices.IFavoriteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class FavoriteServiceImpl implements IFavoriteService {

    private final FavoriteRepo repo;
    private final UserRepo userRepo;
    private final WatchRepo watchRepo;


    @Override
    public FavoriteDTO addFavorite(UUID watchID) {
        User user = getCurrentUser();

        Watch watch = watchRepo.findById(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        if(repo.findByUserAndWatch(user, watch).isPresent()){
            throw new IllegalStateException("Watch is already favorite");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setWatch(watch);
        favorite.setDateAdded(LocalDateTime.now());

        Favorite saved = repo.save(favorite);
        return FavoriteMapper.entityToDTO(saved);
    }

    @Override
    public void removeFavorite(UUID watchID) {
        User user = getCurrentUser();

        Watch watch = watchRepo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        Favorite favorite = repo.findByUserAndWatch(user, watch)
                .orElseThrow(() -> new EntityNotFoundException("Watch is not in your favorites"));

        repo.delete(favorite);
    }

    @Override
    public Page<FavoriteDTO> getMyFavorites(Pageable pageable) {
        User user = getCurrentUser();

        Page<Favorite> favorites = repo.findByUser(user, pageable);
        return favorites.map(FavoriteMapper::entityToDTO);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepo.findByUserName(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found"));
    }
}
