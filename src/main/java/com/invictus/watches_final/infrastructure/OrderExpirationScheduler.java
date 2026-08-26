package com.invictus.watches_final.infrastructure;

import com.invictus.watches_final.services.IServices.IOrderService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class OrderExpirationScheduler {
    private final IOrderService  orderService;

    @Scheduled(fixedRate = 1500000)
    public void cancelExpiredOrders() {
        try {
            orderService.cancelExpiredOrders();
        } catch (Exception e) {
            log.error("Zakazano otkazivanje neplacenih porudzbina nije uspelo", e);
        }
    }
}
