package com.invictus.watches_final.infrastructure;

import com.invictus.watches_final.services.IServices.IOrderService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class OrderExpirationScheduler {
    private final IOrderService  orderService;

    @Scheduled(fixedRate = 1500000)
    public void cancelExpiredOrders() {
        orderService.cancelExpiredOrders();
    }
}
