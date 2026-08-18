package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.WatchDTOs.*;
import com.invictus.watches_final.exceptions.CustomExceptions.ImageProcessingException;
import com.invictus.watches_final.exceptions.CustomExceptions.WatchAlreadyExistsException;
import com.invictus.watches_final.mapper.WatchMapper;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.WatchImage;
import com.invictus.watches_final.model.enums.GenderType;
import com.invictus.watches_final.model.enums.OccasionType;
import com.invictus.watches_final.repository.*;
import com.invictus.watches_final.infrastructure.WatchSpecifications;
import com.invictus.watches_final.services.IServices.IWatchService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class WatchServiceImpl implements IWatchService {

    private final WatchRepo repo;

    private final CartItemRepo cartItemRepo;
    private final OrderItemRepo orderItemRepo;
    private final FavoriteRepo favoriteRepo;

    private static final int MAX_IMAGES_PER_WATCH = 5;
    private final WatchImageRepo watchImageRepo;


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


    @Override
    public WatchDTO editWatch(EditWatchDTO editWatchDTO) {

        validateSaleDates(editWatchDTO.getSaleStartDate(), editWatchDTO.getSaleEndDate());

        Watch existingWatch = repo.findById(editWatchDTO.getWatchID())
                .orElseThrow(() -> new RuntimeException("Watch not found"));


        WatchMapper.editDTOToEntity(editWatchDTO, existingWatch);

        Watch savedWatch = repo.save(existingWatch);

        return WatchMapper.entityToDTO(savedWatch);
    }

    @Override
    public WatchDTO addWatch(AddWatchDTO addWatchDTO,  List<MultipartFile> images) { //dosta izmena moguce greske

        validateSaleDates(addWatchDTO.getSaleStartDate(), addWatchDTO.getSaleEndDate());

        if (images != null && images.size() > MAX_IMAGES_PER_WATCH) {
            throw new IllegalArgumentException("Cannot add more than " + MAX_IMAGES_PER_WATCH + " images per watch");
        }

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

        if (watch.getStock() != null && watch.getStock() > 0) {
            watch.setActive(true);
        } else {
            watch.setActive(false);
        }

        Watch savedWatch = repo.save(watch);

        if (images != null) {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                if (file != null && !file.isEmpty()) {
                    try {
                        WatchImage watchImage = new WatchImage();
                        watchImage.setWatch(savedWatch);
                        watchImage.setImage(file.getBytes());
                        watchImage.setPrimary(i == 0);
                        watchImageRepo.save(watchImage);
                        savedWatch.getImages().add(watchImage);
                    } catch (IOException e) {
                        throw new ImageProcessingException("Error reading image file");
                    }
                }
            }
        }
        return WatchMapper.entityToDTO(savedWatch);
    }



    @Override
    public Page<WatchDTO> getFilteredWatches(String search, String occasion, String gender, String colorFilter, String brandFilter, String mechanismFilter,Float minPrice,
                                             Float maxPrice, String sortBy, String sortDir, int page, int size) {

        String colorFilterModify = (colorFilter != null && !colorFilter.isEmpty()) ? colorFilter : null;
        String brandFilterModify = (brandFilter != null && !brandFilter.isEmpty()) ? brandFilter : null;
        String mechanismFilterModify = (mechanismFilter != null && !mechanismFilter.isEmpty()) ? mechanismFilter : null;
        String searchModify = (search != null && !search.isEmpty()) ? search : null;
        OccasionType occasionFilter = (occasion != null && !occasion.isEmpty())
                ? OccasionType.fromString(occasion) : null;

        GenderType genderFilter = (gender != null && !gender.isEmpty())
                ? GenderType.fromString(gender) : null;


        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy != null &&  !sortBy.isEmpty()) ? sortBy : "price";  // pravljenje sortiranja
        Sort sort = Sort.by(direction, sortField);                                      // i onda rucno pravljenje page
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Watch> spec = Specification.allOf(
                WatchSpecifications.hasBrand(brandFilterModify),
                WatchSpecifications.hasMechanism(mechanismFilterModify),
                WatchSpecifications.hasColor(colorFilterModify),
                WatchSpecifications.priceBetween(minPrice, maxPrice),
                WatchSpecifications.searchTerm(searchModify),
                WatchSpecifications.hasOccasion(occasionFilter),
                WatchSpecifications.hasGender(genderFilter)
        );


        Page<Watch> filteredWatches = repo.findAll(spec, pageable);

        return filteredWatches.map(WatchMapper::entityToDTO);
    }


    @Override
    public void deleteWatch(UUID watchID) {

        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));
        if(cartItemRepo.existsByWatch(watch) || orderItemRepo.existsByWatch(watch)
                || favoriteRepo.existsByWatch(watch)){
            throw new IllegalStateException(
                    "Cannot delete watch " + watch.getBrand() + " " + watch.getModel() +
                            ": it is referenced by an existing cart, order, or favorite"
            );
        }
        repo.delete(watch);
    }

    @Override
    public void reduceStock(UUID watchID, int amount) {
        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        int newAmount = watch.getStock() - amount;

        if(newAmount < 0){
            throw new IllegalArgumentException(
                    "Not enough stock for watch: " + watch.getBrand() + " " + watch.getModel() +
                            " (available: " + watch.getStock() + ", requested: " + amount + ")"
            );
        }

        watch.setStock(newAmount);
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


    @Override
    public void addAmount(AmountDTO amountDTO) {

        Optional<Watch> optionalWatch = repo.findByWatchID(UUID.fromString(amountDTO.getWatchID()));

        if (optionalWatch.isPresent()) {
            Watch watch = optionalWatch.get();
            int newAmount = watch.getStock() + amountDTO.getAmount();
            watch.setStock(newAmount);
            watch.setActive(newAmount > 0);
            repo.save(watch);
        } else {
            throw new EntityNotFoundException("Watch not found");
        }
    }

    @Override
    public WatchImageDTO addImage(UUID watchID, MultipartFile image) {
        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        long currentCount = watchImageRepo.countByWatch(watch);
        if(currentCount >= MAX_IMAGES_PER_WATCH){
           throw new IllegalStateException("Watch already has the maximum of " + MAX_IMAGES_PER_WATCH);
        }

        WatchImage watchImage = new WatchImage();
        watchImage.setWatch(watch);
        try{
            watchImage.setImage(image.getBytes());
        }catch (IOException e){
            throw new ImageProcessingException("Error reading image file");
        }
        watchImage.setPrimary(currentCount == 0);

        WatchImage saved = watchImageRepo.save(watchImage);

        return new WatchImageDTO(saved.getImageID(),
            Base64.getEncoder().encodeToString(saved.getImage()), saved.isPrimary());
    }

    @Override
    public void deleteImage(UUID watchID, UUID imageID) {
        WatchImage image = watchImageRepo.findById(imageID)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));

        if (!image.getWatch().getWatchID().equals(watchID)) {
            throw new IllegalArgumentException("Image does not belong to this watch");
        }

        boolean wasPrimary = image.isPrimary();
        watchImageRepo.delete(image);

        if(wasPrimary){
            List<WatchImage> remaining = watchImageRepo.findByWatch(image.getWatch());
            if (!remaining.isEmpty()) {
                WatchImage newPrimary = remaining.get(0);
                newPrimary.setPrimary(true);
                watchImageRepo.save(newPrimary);
            }
        }

    }

    @Override
    public void setPrimaryImage(UUID watchID, UUID imageID) {
        Watch watch = repo.findById(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        List<WatchImage> images = watchImageRepo.findByWatch(watch);

        boolean found = images.stream().anyMatch(image -> image.getImageID().equals(imageID));
        if(!found){
            throw new EntityNotFoundException("Image not found for this watch");
        }

        for(WatchImage img  : images){
            img.setPrimary(img.getImageID().equals(imageID));
        }
        watchImageRepo.saveAll(images);
    }

    private void validateSaleDates(LocalDate saleStartDate, LocalDate saleEndDate) {
        if(saleEndDate != null && saleStartDate != null && saleEndDate.isBefore(saleStartDate)) {
            throw new IllegalArgumentException("Sale end date cannot be before sale start date");
        }
    }
}

