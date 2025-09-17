package com.invictus.watches_final.services;

import com.invictus.watches_final.dto.WatchDTOs.AddWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.AmountDTO;
import com.invictus.watches_final.dto.WatchDTOs.EditWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchDTO;
import com.invictus.watches_final.exceptions.CustomExceptions.ImageProcessingException;
import com.invictus.watches_final.exceptions.CustomExceptions.WatchAlreadyExistsException;
import com.invictus.watches_final.mapper.WatchMapper;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.repository.WatchRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class WatchServiceImpl implements IWatchService{

    private final WatchRepo repo;

    @Override
    public Page<WatchDTO> getAllWatchesPage(Pageable pageable) {//paginacija za vracanje svih elemenata, moguca greska , ugradjen metoda
        if(pageable.getPageNumber() < 0 || pageable.getPageSize() < 0){
            throw new IllegalArgumentException("Invalid page number or page size value");
        }
        return repo.findAll(pageable).map(WatchMapper::entityToDTO);
    }

    @Override
    public Optional<Watch> getOneWatch(UUID watchID) {
        return repo.findById(watchID);
    }

//    @Override
//    public boolean existsByBrandAndModelAndMechanism(String brand, String model, String mechanism) {
//        return repo.existsByBrandAndModelAndMechanism(brand, model, mechanism);
//    }

    @Override
    public WatchDTO editWatch(EditWatchDTO editWatchDTO, MultipartFile image) {

        Watch existingWatch = repo.findById(editWatchDTO.getWatchID())
                .orElseThrow(() -> new RuntimeException("Watch not found"));

        //Watch updatedWatch = WatchMapper.editDTOToEntity(editWatchDTO, existingWatch); // da li ce ovde primati id u bazi?

        WatchMapper.editDTOToEntity(editWatchDTO, existingWatch);

        if (image != null && !image.isEmpty()) {
            try {
                existingWatch.setImage(image.getBytes());
            } catch (IOException e) {
                throw new ImageProcessingException("Error reading image file");
            }
        }

//        if (existingWatch.getAvailable() != null) {
//            existingWatch.setActive(existingWatch.getAvailable() > 0);
//        } else {
//            existingWatch.setActive(false);
//        } zato sto se rucno dodaje ili s addmount ili ovako, cim se edituje znaci da je pozitivan

        Watch savedWatch = repo.save(existingWatch);

        return WatchMapper.entityToDTO(savedWatch);
    }

    @Override
    public WatchDTO addWatch(AddWatchDTO addWatchDTO, MultipartFile image) { //dosta izmena moguce greske

        Optional<Watch> exists = repo.findByBrandAndModelAndMechanismAndColor(
                addWatchDTO.getBrand(),
                addWatchDTO.getModel(),
                addWatchDTO.getMechanism(),
                addWatchDTO.getColor()  //provera duplikata
        );

        if(exists.isPresent()){
            throw new WatchAlreadyExistsException(
                    "Watch with brand '" + addWatchDTO.getBrand() +
                            "', model '" + addWatchDTO.getModel() +
                            "', mechanism '" + addWatchDTO.getMechanism() +
                            "' and color '" + addWatchDTO.getColor() +
                            "' already exists."
            );
        }


        Watch watch = WatchMapper.addDtoToEntity(addWatchDTO);

        if(image != null && !image.isEmpty()) {
            try {
                watch.setImage(image.getBytes());
            } catch (IOException e) {
                throw new ImageProcessingException("Error reading image file");
            }
        }

        if (watch.getAvailable() != null && watch.getAvailable() > 0) {
            watch.setActive(true);
        } else {
            watch.setActive(false);
        }


        Watch savedWatch = repo.save(watch);

        return WatchMapper.entityToDTO(savedWatch);
    }


    //dodati dodatnih filtera mzoda
    //implemntirano i sortiranje
    @Override
    public Page<WatchDTO> getFilteredWatches(String colorFilter, String brandFilter, String mechanismFilter,Float minPrice,
                                             Float maxPrice, String sortBy, String sortDir, int page, int size) {

        String colorFilterModify = (colorFilter != null && !colorFilter.isEmpty()) ? "%" + colorFilter + "%" : null;
        String brandFilterModify = (brandFilter != null && !brandFilter.isEmpty()) ? "%" + brandFilter + "%" : null;
        String mechanismFilterModify = (mechanismFilter != null && !mechanismFilter.isEmpty()) ? "%" + mechanismFilter + "%" : null;


        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;

        String sortField = (sortBy != null &&  !sortBy.isEmpty()) ? sortBy : "price";  // pravljenje sortiranja
        Sort sort = Sort.by(direction, sortField);                                      // i onda rucno pravljenje page

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Watch> filteredWatches = repo.filteredWatches
                (colorFilterModify, brandFilterModify, mechanismFilterModify, minPrice, maxPrice, pageable);

        return filteredWatches.map(WatchMapper::entityToDTO);
    }


    @Override
    public boolean deleteWatch(UUID watchID) {
        if(!repo.existsById(watchID)){
            return false;
        }
        try{
            repo.deleteById(watchID);
            return true;
        }catch(Exception e){
            return false;
        }

    }

    @Override
    public void reduceStock(UUID watchID, int amount) {
        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        int newAmount = watch.getAvailable() - amount;

        if(newAmount < 0){
            throw new IllegalArgumentException("Not enough stock");
        }

        watch.setAvailable(newAmount);
        watch.setActive(newAmount > 0);

        repo.save(watch);
    }

    @Override
    public String setWatchStatus(UUID watchID, boolean status) {
        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        watch.setActive(status);
        repo.save(watch);
        return "Watch has been updated";
    }

//    @Override
//    public void addAmount(AmountDTO amountDTO) {
//        Watch watch = repo.findByWatchID(UUID.fromString(amountDTO.getWatchID()));
//        if (watch != null) {
//            Integer newAmount = watch.getAvailable() + amountDTO.getAmount();
//            watch.setAvailable(newAmount);
//            repo.save(watch);
//        }
//    }

    // ili ovo gore ili ovo dole ispravnije sa Optional

    @Override
    public void addAmount(AmountDTO amountDTO) {

//        if(amountDTO.getAmount() == null || amountDTO.getAmount() < 0){
//            throw new IllegalArgumentException("Amount must be greater than 0");
//

        Optional<Watch> optionalWatch = repo.findByWatchID(UUID.fromString(amountDTO.getWatchID()));

        if (optionalWatch.isPresent()) {
            Watch watch = optionalWatch.get();
            int newAmount = watch.getAvailable() + amountDTO.getAmount();
            watch.setAvailable(newAmount);
            watch.setActive(newAmount > 0);
            repo.save(watch);
        } else {
            throw new EntityNotFoundException("Watch not found");
        }
    }



}
