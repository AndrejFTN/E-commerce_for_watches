package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Favorite;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.model.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepo extends JpaRepository<Favorite, UUID> {

    Page<Favorite> findByUser(User user, Pageable pageable);

    Optional<Favorite> findByUserAndWatch(User user, Watch watch);
}
