package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.AccountDTOs.AdminDashboardDTO;
import com.invictus.watches_final.model.enums.OrderStatus;
import com.invictus.watches_final.repository.OrderRepo;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.repository.WatchRepo;
import com.invictus.watches_final.services.IServices.IDashboardService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class DashboardServiceImpl implements IDashboardService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final UserRepo userRepo;
    private final OrderRepo orderRepo;
    private final WatchRepo watchRepo;


    @Override
    public AdminDashboardDTO getDashboardStats() {

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        double totalRevenue = orderRepo.getTotalRevenue(OrderStatus.PAID);
        double monthlyRevenue = orderRepo.getRevenueSince(OrderStatus.PAID, startOfMonth);
        long paidOrderCount = orderRepo.countByStatus(OrderStatus.PAID);

        double averageOrderValue = paidOrderCount == 0 ?  0.0 : totalRevenue / paidOrderCount;

        return new AdminDashboardDTO(
                monthlyRevenue,
                totalRevenue,
                userRepo.count(),
                userRepo.countByVerified(false),
                userRepo.countByRegistrationDateAfter(startOfMonth),
                watchRepo.countByStockLessThan(LOW_STOCK_THRESHOLD),
                averageOrderValue
        );
    }
}
