package com.invictus.watches_final.dto.AccountDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {

    private double monthlyRevenue;
    private double totalRevenue;
    private long totalUsers;
    private long unverifiedUsers;
    private long newUsersThisMonth;
    private long lowStockWatches;
    private double averageOrderValue;
}
