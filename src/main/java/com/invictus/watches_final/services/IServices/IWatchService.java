package com.invictus.watches_final.services.IServices;


import com.invictus.watches_final.dto.WatchDTOs.AddWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.AmountDTO;
import com.invictus.watches_final.dto.WatchDTOs.EditWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchDTO;
import com.invictus.watches_final.model.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

public interface IWatchService {

    Page<WatchDTO> getAllWatchesPage(Pageable pageable);

    //List<WatchDTO> getAllWatchesList();

    Optional<Watch> getOneWatch(UUID watchID); //mozda dto

    //boolean existsByBrandAndModelAndMechanism(String brand,String model,String mechanism);

    WatchDTO editWatch(EditWatchDTO watchDTO, MultipartFile image);

    WatchDTO addWatch(AddWatchDTO addWatchDTO, MultipartFile image);

    void deleteWatch(UUID watchID);

    void reduceStock(UUID watchID, int amount);

    String setWatchStatus(UUID watchID, boolean status);

    Page<WatchDTO> getFilteredWatches(String search, String occasion, String gender, String colorFilter, String brandFilter, String mechanismFilter,Float minPrice,
                                      Float maxPrice,String sortBy, String orderBy, int page, int size);



    void addAmount(AmountDTO amountDTO); //IStraziti da li postoji bolja implementacija ove funkcije
}
