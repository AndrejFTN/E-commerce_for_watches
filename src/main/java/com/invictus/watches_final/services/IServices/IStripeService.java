package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.model.Order;
import com.stripe.model.checkout.Session;

public interface IStripeService {
    Session createCheckoutSession(Order order);
}
