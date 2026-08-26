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
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class WatchServiceImpl implements IWatchService {

    private final WatchRepo repo;

    private final CartItemRepo cartItemRepo;
    private final OrderItemRepo orderItemRepo;
    private final FavoriteRepo favoriteRepo;

    private static final int MAX_IMAGES_PER_WATCH = 5;
    private static final List<String> ALLOWED_IMAGE_TYPES =
            List.of("image/jpeg", "image/png", "image/webp");
    private final WatchImageRepo watchImageRepo;


    @Override
    public Page<WatchListDTO> getAllWatchesPage(Pageable pageable) {
        if(pageable.getPageNumber() < 0 || pageable.getPageSize() < 0){
            throw new IllegalArgumentException("Invalid page number or page size value");
        }
        return toListPage(repo.findAll(pageable));

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
    public WatchDTO addWatch(AddWatchDTO addWatchDTO) {

        validateSaleDates(addWatchDTO.getSaleStartDate(), addWatchDTO.getSaleEndDate());

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

        watch.setCreatedAt(LocalDateTime.now());

        if (watch.getStock() != null && watch.getStock() > 0) {
            watch.setActive(true);
        } else {
            watch.setActive(false);
        }

        Watch savedWatch = repo.save(watch);

        return WatchMapper.entityToDTO(savedWatch);
    }

    @Override
    public FilterOptionsDTO getFilterOptions(){
        FilterOptionsDTO filterOptionsDTO = new FilterOptionsDTO();

        filterOptionsDTO.setBrands(repo.findDistinctBrands());
        filterOptionsDTO.setColors(repo.findDistinctColors());
        filterOptionsDTO.setMechanisms(repo.findDistinctMechanisms());

        filterOptionsDTO.setGenders(repo.findDistinctGenders()
                .stream()
                .map(GenderType::toValue)
                .sorted()
                .toList());

        filterOptionsDTO.setOccasions(repo.findDistinctOccasions()
                .stream()
                .map(OccasionType::toValue)
                .sorted()
                .toList());

        Float min = repo.findMinPrice();
        Float max = repo.findMaxPrice();
        filterOptionsDTO.setMinPrice(min != null ? min : 0f);
        filterOptionsDTO.setMaxPrice(max != null ? max : 0f);

        return filterOptionsDTO;
    }

    @Override
    public Page<WatchListDTO> getFilteredWatches(String search, List<String> occasions, List<String> genders,
                                                 List<String> colors, List<String> brands, List<String> mechanisms,
                                                 Float minPrice, Float maxPrice,
                                                 String sortBy, String sortDir, int page, int size, Boolean onSale,
                                                 Integer maxStock) {

        String searchModify = (search != null && !search.isEmpty()) ? search : null;

        List<OccasionType> occasionFilter = (occasions == null || occasions.isEmpty()) ? null
                : occasions.stream().map(OccasionType::fromString).toList();   // baca 400 ako je vrednost pogrešna

        List<GenderType> genderFilter = (genders == null || genders.isEmpty()) ? null
                : genders.stream().map(GenderType::fromString).toList();

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy != null && !sortBy.isEmpty()) ? sortBy : "price";
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Specification<Watch> spec = Specification.allOf(
                WatchSpecifications.hasBrand(brands),
                WatchSpecifications.stockBelow(maxStock),
                WatchSpecifications.hasMechanism(mechanisms),
                WatchSpecifications.hasColor(colors),
                WatchSpecifications.priceBetween(minPrice, maxPrice),
                WatchSpecifications.searchTerm(searchModify),
                WatchSpecifications.hasOccasion(occasionFilter),
                WatchSpecifications.hasGender(genderFilter),
                WatchSpecifications.onSaleOnly(onSale)
        );

        return toListPage(repo.findAll(spec, pageable));
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

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty");
        }

        String type = image.getContentType();
        if (type == null || !ALLOWED_IMAGE_TYPES.contains(type.toLowerCase())) {
            throw new IllegalArgumentException("Only JPEG, PNG and WebP images are allowed");
        }

        Watch watch = repo.findByWatchID(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found"));

        long currentCount = watchImageRepo.countByWatch(watch);
        if (currentCount >= MAX_IMAGES_PER_WATCH) {
            throw new IllegalStateException(
                    "Watch already has the maximum of " + MAX_IMAGES_PER_WATCH + " images");
        }

        WatchImage watchImage = new WatchImage();
        watchImage.setWatch(watch);
        watchImage.setContentType(type);
        watchImage.setPrimary(currentCount == 0);

        try {
            watchImage.setImage(image.getBytes());
        } catch (IOException e) {
            throw new ImageProcessingException("Error reading image file");
        }

        WatchImage saved = watchImageRepo.save(watchImage);

        return new WatchImageDTO(saved.getImageID(), saved.isPrimary());
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
    public WatchImage getImage(UUID imageID) {
        return watchImageRepo.findById(imageID)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));
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

    @Override
    public List<ActiveSaleDTO> getActiveSales() {
        return repo.findActiveSales(PageRequest.of(0, 6))
                .stream()
                .map(r -> new ActiveSaleDTO(
                        (UUID)      r[0],
                        (String)    r[1],
                        (String)    r[2],
                        (Integer)   r[3],
                        (LocalDate) r[4]))
                .toList();
    }

    private void validateSaleDates(LocalDate saleStartDate, LocalDate saleEndDate) {
        if(saleEndDate != null && saleStartDate != null && saleEndDate.isBefore(saleStartDate)) {
            throw new IllegalArgumentException("Sale end date cannot be before sale start date");
        }
    }

    private Page<WatchListDTO> toListPage(Page<Watch> watches) {
        List<UUID> ids = watches.getContent().stream()
                .map(Watch::getWatchID)
                .toList();

        Map<UUID, UUID> primaryByWatch = ids.isEmpty()
                ? Map.of()
                : watchImageRepo.findPrimaryImageIDs(ids).stream()
                .collect(Collectors.toMap(
                        r -> (UUID) r[0],
                        r -> (UUID) r[1],
                        (a, b) -> a));      // zastita ako sat greskom ima 2 primarne

        return watches.map(w -> WatchMapper.entityToListDTO(w, primaryByWatch.get(w.getWatchID())));
    }
}

