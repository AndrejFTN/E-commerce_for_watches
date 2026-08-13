package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.FavoriteDTOs.FavoriteDTO;
import com.invictus.watches_final.services.IServices.IFavoriteService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/favorite")
public class FavoriteController {

    private final IFavoriteService service;

    @PreAuthorize("hasAnyAuthority('USER_ROLE', 'ADMIN_ROLE')")
    @PostMapping("/addFavorite/{watchID}")
    public ResponseEntity<FavoriteDTO> addFavorite(@PathVariable("watchID") UUID watchID) {
        FavoriteDTO favorite = service.addFavorite(watchID);
        return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @DeleteMapping("/removeFavorite/{watchID}")
    public ResponseEntity<String> removeFavorite(@PathVariable("watchID") UUID watchID) {
        service.removeFavorite(watchID);
        return ResponseEntity.ok("Watch removed from favorites");
    }


    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @GetMapping("/getMyFavorites")
    public ResponseEntity<Page<FavoriteDTO>> getMyFavorites(Pageable pageable) {
        Page<FavoriteDTO> favorites = service.getMyFavorites(pageable);
        return ResponseEntity.ok(favorites);
    }

}
