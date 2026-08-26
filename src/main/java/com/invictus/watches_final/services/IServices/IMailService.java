package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.model.Order;

public interface IMailService {
    void sendSimpleMessage(String subject, String text, String... to);
    void sendVerificationEmail(String to, String token);
    void sendOrderConfirmationEmail(String to, Order order);
    void sendResetPassword(String to, String userName, String token);
}
