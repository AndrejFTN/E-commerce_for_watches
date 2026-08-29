package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.WatchDTOs.*;
import com.invictus.watches_final.model.Watch;

import java.util.List;
import java.util.UUID;
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

        watchDTO.setDescription(watch.getDescription());
        watchDTO.setNewArrival(watch.isNewArrival());


        List<WatchImageDTO> imageDTOs = watch.getImages().stream()
                .map(img -> new WatchImageDTO(img.getImageID(), img.isPrimary()))
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

        watch.setDescription(watchDTO.getDescription());

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

        existingWatch.setDescription(editDTO.getDescription());

        existingWatch.setDiscountPercentage(editDTO.getDiscountPercentage());
        existingWatch.setSaleStartDate(editDTO.getSaleStartDate());
        existingWatch.setSaleEndDate(editDTO.getSaleEndDate());
        return existingWatch;
    }

    public static WatchListDTO entityToListDTO(Watch watch, UUID primaryImageID) {
        WatchListDTO dto = new WatchListDTO();

        dto.setWatchID(watch.getWatchID());
        dto.setBrand(watch.getBrand());
        dto.setModel(watch.getModel());
        dto.setColor(watch.getColor());
        dto.setMechanism(watch.getMechanism());
        dto.setManufactureDate(watch.getManufactureDate());
        dto.setStock(watch.getStock());
        dto.setActive(watch.isActive());
        dto.setGender(watch.getGender());
        dto.setOccasion(watch.getOccasion());

        dto.setNewArrival(watch.isNewArrival());

        dto.setPrice(watch.getPrice());
        dto.setEffectivePrice(watch.getEffectivePrice());
        dto.setOnSale(watch.isOnSale());
        dto.setDiscountPercentage(watch.getDiscountPercentage());

        dto.setPrimaryImageID(primaryImageID);

        return dto;
    }

}
