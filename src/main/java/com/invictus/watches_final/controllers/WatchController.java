package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.WatchDTOs.*;
import com.invictus.watches_final.mapper.WatchMapper;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.model.WatchImage;
import com.invictus.watches_final.services.IServices.IWatchService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/watch")
@AllArgsConstructor
public class WatchController {
    private final IWatchService service;

    @GetMapping("/getAll")
    public ResponseEntity<Page<WatchListDTO>> getAllWatches(Pageable pageable){
        return ResponseEntity.ok(service.getAllWatchesPage(pageable));
    }

    @GetMapping("/getOneWatch/{watchID}")
    public ResponseEntity<WatchDTO> getOneWatch(@PathVariable UUID watchID){
        Watch watch = service.getOneWatch(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found ID:" + watchID));
        return ResponseEntity.ok(WatchMapper.entityToDTO(watch));
    }

    @GetMapping("/filterOptions")
    public ResponseEntity<FilterOptionsDTO> getFilterOptions(){
        return ResponseEntity.ok(service.getFilterOptions());
    }

    @GetMapping("/filterWatches")
    public ResponseEntity<Page<WatchListDTO>> getFilteredWatches(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> occasion,
            @RequestParam(required = false) List<String> gender,
            @RequestParam(required = false) List<String> color,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) List<String> mechanism,
            @RequestParam(required = false) Float minPriceFilter,
            @RequestParam(required = false) Float maxPriceFilter,
            @RequestParam(required = false) Boolean onSale,
            @RequestParam(defaultValue = "0") int page,  // u servisu se pravi page a ovde se se proseldjuej svaki parametar
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) Integer maxStock) {

        if(minPriceFilter != null && maxPriceFilter != null && minPriceFilter > maxPriceFilter){
            throw new IllegalArgumentException("minPrice cannot be greater than maxPrice");
        }

        Page<WatchListDTO> result = service.getFilteredWatches(search, occasion, gender, color, brand, mechanism,
                                                            minPriceFilter, maxPriceFilter,
                                                            sortBy, sortDir, page, size, onSale, maxStock);

        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping(path = "/editWatch")
    public ResponseEntity<WatchDTO> editWatch(
            @Valid @RequestBody EditWatchDTO editWatchDTO) {

        WatchDTO newWatch = service.editWatch(editWatchDTO);
        return ResponseEntity.ok(newWatch);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping(path ="/statusWatch/{watchID}")
    public ResponseEntity<String> setWatchStatus(@PathVariable UUID watchID, @RequestParam boolean status) {
        return ResponseEntity.ok(service.setWatchStatus(watchID, status));
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PostMapping(path = "/addWatch")
    public ResponseEntity<WatchDTO> addWatch(@Valid @RequestBody AddWatchDTO addWatchDTO){
        WatchDTO watchDTO = service.addWatch(addWatchDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(watchDTO);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping("/addAmount")  // da li je ovo da se doda kolicina prilikom dodavanja sata
    public ResponseEntity<String> addAmount(@Valid @RequestBody AmountDTO amountDTO){
        service.addAmount(amountDTO);
        return ResponseEntity.ok("Amount added successfully");
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @DeleteMapping("/deleteWatch/{watchID}")
    public ResponseEntity<String> deleteWatch(@PathVariable UUID watchID){
        service.deleteWatch(watchID); // baca EntityNotFoundException ako ne postoji
        return ResponseEntity.ok("Watch deleted successfully");
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PostMapping(path="/{watchID}/addImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WatchImageDTO> addImage(@PathVariable UUID watchID,
                                                  @RequestPart("image") MultipartFile image){

        WatchImageDTO imageDTO = service.addImage(watchID, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageDTO);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @DeleteMapping("/{watchID}/deleteImage/{imageID}")
    public ResponseEntity<String> deleteImage(@PathVariable UUID watchID, @PathVariable UUID imageID) {
        service.deleteImage(watchID, imageID);
        return ResponseEntity.ok("Image deleted successfully");
    }

    @GetMapping("/image/{imageID}")
    public ResponseEntity<byte[]> getImage(@PathVariable UUID imageID) {
        WatchImage img = service.getImage(imageID);

        String type = (img.getContentType() != null)
                ? img.getContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(type))
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic())
                .body(img.getImage());
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping("/{watchID}/setPrimaryImage/{imageID}")
    public ResponseEntity<String> setPrimaryImage(@PathVariable UUID watchID, @PathVariable UUID imageID) {
        service.setPrimaryImage(watchID, imageID);
        return ResponseEntity.ok("Primary image updated");
    }

    @GetMapping("/activeSales")
    public ResponseEntity<List<ActiveSaleDTO>> getActiveSales(){
        return ResponseEntity.ok(service.getActiveSales());
    }

}
