package com.invictus.watches_final.services.IServices;


import com.invictus.watches_final.dto.WatchDTOs.*;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.WatchImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IWatchService {

    Page<WatchListDTO> getAllWatchesPage(Pageable pageable);

    Optional<Watch> getOneWatch(UUID watchID); //mozda dto

    WatchDTO editWatch(EditWatchDTO watchDTO);

    WatchDTO addWatch(AddWatchDTO addWatchDTO);

    void deleteWatch(UUID watchID);

    void reduceStock(UUID watchID, int amount);

    String setWatchStatus(UUID watchID, boolean status);

    Page<WatchListDTO> getFilteredWatches(String search, List<String> occasions, List<String> genders,
                                          List<String> colors, List<String> brands, List<String> mechanisms,
                                          Float minPrice, Float maxPrice,
                                          String sortBy, String sortDir, int page, int size,  Boolean onSale, Integer maxStock,
                                          Boolean newArrival, Boolean visibleOnly);



    FilterOptionsDTO getFilterOptions();

    void addAmount(AmountDTO amountDTO); //IStraziti da li postoji bolja implementacija ove funkcije

    WatchImageDTO addImage(UUID watchID, MultipartFile image);
    void deleteImage(UUID watchID, UUID imageID);
    void setPrimaryImage(UUID watchID, UUID imageID);
    WatchImage getImage(UUID imageID);

    List<ActiveSaleDTO> getActiveSales();
}
