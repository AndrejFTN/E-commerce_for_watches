package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.WatchImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WatchImageRepo extends JpaRepository<WatchImage, UUID> {

    List<WatchImage> findByWatch(Watch watch);

    long countByWatch(Watch watch);

    @Query("SELECT wi.watch.watchID, wi.imageID FROM WatchImage wi " +
            "WHERE wi.watch.watchID IN :watchIDs AND wi.isPrimary = true")
    List<Object[]> findPrimaryImageIDs(@Param("watchIDs") List<UUID> watchIDs);
}
