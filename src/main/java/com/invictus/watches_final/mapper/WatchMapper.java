package com.invictus.watches_final.mapper;

import com.invictus.watches_final.dto.WatchDTOs.AddWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.EditWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchDTO;
import com.invictus.watches_final.model.Watch;

import java.util.Base64;

public class WatchMapper {

    public static WatchDTO entityToDTO(Watch watch){
        WatchDTO watchDTO = new WatchDTO();

        watchDTO.setBrand(watch.getBrand());
        watchDTO.setColor(watch.getColor());
        watchDTO.setMechanism(watch.getMechanism());
        watchDTO.setModel(watch.getModel());
        watchDTO.setManufactureDate(watch.getManufactureDate());
        watchDTO.setPrice(watch.getPrice());
        watchDTO.setAvailable(watch.getAvailable());
        watchDTO.setGender(watch.getGender());

        if (watch.getImage() != null) {
            String base64Image = Base64.getEncoder().encodeToString(watch.getImage());
            watchDTO.setImage(base64Image);
        }

        return watchDTO;
    }

    public static Watch addDtoToEntity(AddWatchDTO watchDTO){
        Watch watch = new Watch();

        watch.setBrand(watchDTO.getBrand());
        watch.setColor(watchDTO.getColor());
        watch.setMechanism(watchDTO.getMechanism());
        watch.setModel(watchDTO.getModel());
        watch.setManufactureDate(watchDTO.getManufactureDate());
        watch.setPrice(watchDTO.getPrice());
        watch.setAvailable(watchDTO.getAvailable());
        watch.setGender(watchDTO.getGender());

        return watch;
    }

    public static Watch editDTOToEntity(EditWatchDTO editDTO, Watch existingWatch) {
        existingWatch.setBrand(editDTO.getBrand());
        existingWatch.setColor(editDTO.getColor());
        existingWatch.setMechanism(editDTO.getMechanism());
        existingWatch.setModel(editDTO.getModel());
        existingWatch.setManufactureDate(editDTO.getManufactureDate());
        existingWatch.setPrice(editDTO.getPrice());
        existingWatch.setAvailable(editDTO.getAvailable());
        existingWatch.setGender(editDTO.getGender());
        // slika se postavlja u servisu
        return existingWatch;
    }

}
