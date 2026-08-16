package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.OrderItem;
import com.invictus.watches_final.services.IServices.IStripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StripeServiceImpl implements IStripeService {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }


    @Override
    public Session createCheckoutSession(Order order) {
        List<SessionCreateParams.LineItem> lineItems = order.getOrderItems().stream()
                .map(this::toLineItem)
                .collect(Collectors.toList());


        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setClientReferenceId(order.getOrderID().toString())
                .addAllLineItem(lineItems)
                .build();

        try {
            return Session.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Stripe session creation failed: " + e.getMessage());
        }
    }

    private SessionCreateParams.LineItem toLineItem(OrderItem item) {
        long unitAmountInCents = Math.round(item.getPrice() * 100);

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(item.getWatch().getBrand() + " " + item.getWatch().getModel())
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("eur")
                        .setUnitAmount(unitAmountInCents)
                        .setProductData(productData)
                        .build();

        return SessionCreateParams.LineItem.builder()
                .setQuantity((long) item.getAmount())
                .setPriceData(priceData)
                .build();
    }
}
