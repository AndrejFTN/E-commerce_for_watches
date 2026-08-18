package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.AccountDTOs.AdminDashboardDTO;
import com.invictus.watches_final.services.IServices.IDashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/admin/dashboard")
public class DashboardController {

    private final IDashboardService dashboradService;

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        AdminDashboardDTO stats = dashboradService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
