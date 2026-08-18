package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.WatchDTOs.AddWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.EditWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchImageDTO;
import com.invictus.watches_final.model.Watch;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

public class WatchMapper {

    public static WatchDTO entityToDTO(Watch watch){
        WatchDTO watchDTO = new WatchDTO();

        watchDTO.setBrand(watch.getBrand());
        watchDTO.setColor(watch.getColor());
        watchDTO.setMechanism(watch.getMechanism());
        watchDTO.setModel(watch.getModel());
        watchDTO.setManufactureDate(watch.getManufactureDate());
        watchDTO.setPrice(watch.getPrice());
        watchDTO.setStock(watch.getStock());
        watchDTO.setGender(watch.getGender());
        watchDTO.setOccasion(watch.getOccasion());
        watchDTO.setActive(watch.isActive());
        watchDTO.setWatchID(watch.getWatchID());

        List<WatchImageDTO> imageDTOs = watch.getImages().stream()
                .map(img -> new WatchImageDTO(
                        img.getImageID(),
                        Base64.getEncoder().encodeToString(img.getImage()),
                        img.isPrimary()
                ))
                .collect(Collectors.toList());
        watchDTO.setImages(imageDTOs);

        watchDTO.setDiscountPercentage(watch.getDiscountPercentage());
        watchDTO.setSaleStartDate(watch.getSaleStartDate());
        watchDTO.setSaleEndDate(watch.getSaleEndDate());
        watchDTO.setOnSale(watch.isOnSale());
        watchDTO.setEffectivePrice(watch.getEffectivePrice());

        return watchDTO;
    }

    public static Watch addDtoToEntity(AddWatchDTO watchDTO){
        Watch watch = new Watch();

        watch.setBrand(watchDTO.getBrand());
        watch.setColor(watchDTO.getColor());
        watch.setMechanism(watchDTO.getMechanism());
        watch.setOccasion(watchDTO.getOccasion());
        watch.setModel(watchDTO.getModel());
        watch.setManufactureDate(watchDTO.getManufactureDate());
        watch.setPrice(watchDTO.getPrice());
        watch.setStock(watchDTO.getStock());
        watch.setGender(watchDTO.getGender());

        watch.setDiscountPercentage(watchDTO.getDiscountPercentage());
        watch.setSaleStartDate(watchDTO.getSaleStartDate());
        watch.setSaleEndDate(watchDTO.getSaleEndDate());

        return watch;
    }

    public static Watch editDTOToEntity(EditWatchDTO editDTO, Watch existingWatch) {
        existingWatch.setBrand(editDTO.getBrand());
        existingWatch.setColor(editDTO.getColor());
        existingWatch.setMechanism(editDTO.getMechanism());
        existingWatch.setModel(editDTO.getModel());
        existingWatch.setManufactureDate(editDTO.getManufactureDate());
        existingWatch.setPrice(editDTO.getPrice());
        existingWatch.setOccasion(editDTO.getOccasion());
        existingWatch.setStock(editDTO.getStock());
        existingWatch.setGender(editDTO.getGender());
        // slika se postavlja u servisu

        existingWatch.setDiscountPercentage(editDTO.getDiscountPercentage());
        existingWatch.setSaleStartDate(editDTO.getSaleStartDate());
        existingWatch.setSaleEndDate(editDTO.getSaleEndDate());
        return existingWatch;
    }

}
