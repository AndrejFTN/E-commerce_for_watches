package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.AccountDTOs.RequestDTO;
import com.invictus.watches_final.services.IServices.IRequestService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/request")
@AllArgsConstructor
public class RequestController {

    private final IRequestService requestService;

    @PostMapping
    public ResponseEntity<String> sendRequest(@Valid @RequestBody RequestDTO requestDTO){
        return ResponseEntity.ok(requestService.sendRequest(requestDTO));
    }
}
