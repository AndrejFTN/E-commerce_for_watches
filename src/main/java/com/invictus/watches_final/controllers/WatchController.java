package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.WatchDTOs.AddWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.AmountDTO;
import com.invictus.watches_final.dto.WatchDTOs.EditWatchDTO;
import com.invictus.watches_final.dto.WatchDTOs.WatchDTO;
import com.invictus.watches_final.mapper.WatchMapper;
import com.invictus.watches_final.model.Watch;
import com.invictus.watches_final.services.IWatchService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("/watch")
@AllArgsConstructor
@CrossOrigin("*")
public class WatchController {
    private final IWatchService service;

    @GetMapping("/getAll")
    public ResponseEntity<Page<WatchDTO>> getAllWatches(Pageable pageable){
        Page<WatchDTO> watchesPage = service.getAllWatchesPage(pageable);
        if (watchesPage.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(watchesPage);
    }

    @GetMapping("/getOneWatch/{watchID}")
    public ResponseEntity<WatchDTO> getOneWatch(@PathVariable UUID watchID){
        Watch watch = service.getOneWatch(watchID)
                .orElseThrow(() -> new EntityNotFoundException("Watch not found ID:" + watchID));
        return ResponseEntity.ok(WatchMapper.entityToDTO(watch));
    }

//        try{
//            Page<WatchDTO> watchesPage = service.getAllWatchesPage(pageable);
//
//            if(watchesPage.isEmpty()){
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Map.of(
//                        "status", HttpStatus.NO_CONTENT.value(),
//                        "message", "No watches found"));
//            }
//
//            return ResponseEntity.ok(Map.of(
//                    "status", HttpStatus.OK.value(),
//                    "page", watchesPage.getNumber(),
//                    "totalPages", watchesPage.getTotalPages(),
//                    "totalElements", watchesPage.getTotalElements(),
//                    "watches", watchesPage.getContent()
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of(
//                            "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                            "error", "Error fetching pages",
//                            "details", e.getMessage()
//                    ));
//        }

//    @GetMapping(path = "/getOneWatch/{watchID}")
//    public ResponseEntity<?> getOneWatch(@PathVariable UUID watchID){
//        Optional<Watch> watchOptional = service.getOneWatch(watchID);
//
//        if(watchOptional.isEmpty()){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ID doesn't exist");
//        }else {
//         Watch watch = watchOptional.get();
//         WatchDTO watchDTO = WatchMapper.entityToDTO(watch);
//         return ResponseEntity.ok(watchDTO);
//        }
//    }
    //@GetMapping(path = "/getOneWatch/{watchID})
    //public ResponseEntity<?> getOneWatch(@PathVariable UUID watchID){
    // return service.getOneWatch(watchID)
    //               .map(watch -> ResponseEntity.ok(WatchMapper.entityToDTO(watchID)))
    //               .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("ID doesn't exist));
    // --- druga mogucnostu za get one----


    @GetMapping("/filterWatches")
    public ResponseEntity<Page<WatchDTO>> getFilteredWatches(
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String mechanism,
            @RequestParam(required = false) Float minPriceFilter,
            @RequestParam(required = false) Float maxPriceFilter,
            @RequestParam(defaultValue = "0") int page,  // u servisu se pravi page a ovde se se proseldjuej svaki parametar
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        if(minPriceFilter != null && maxPriceFilter != null && minPriceFilter > maxPriceFilter){
            throw new IllegalArgumentException("minPrice cannot be greater than maxPrice");
        }

        Page<WatchDTO> result = service.getFilteredWatches(color, brand, mechanism,
                                                            minPriceFilter, maxPriceFilter,
                                                            sortBy, sortDir, page, size);

        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping(path = "/editWatch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WatchDTO> editWatch(
            @Valid @ModelAttribute EditWatchDTO editWatchDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        WatchDTO newWatch = service.editWatch(editWatchDTO, image);
        return ResponseEntity.ok(newWatch);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PutMapping(path ="/statusWatch/{watchID}")
    public ResponseEntity<String> setWatchStatus(@PathVariable UUID watchID, @RequestParam boolean status) {
        return ResponseEntity.ok(service.setWatchStatus(watchID, status));
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @PostMapping(path = "/addWatch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WatchDTO> addWatch(
            @Valid @ModelAttribute AddWatchDTO addWatchDTO,
            @RequestPart(value = "image", required = false) MultipartFile image){

        WatchDTO watchDTO = service.addWatch(addWatchDTO, image);
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
}
