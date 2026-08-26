package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.model.Order;
import com.invictus.watches_final.model.OrderItem;
import com.invictus.watches_final.services.IServices.IMailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Arrays;

@Slf4j
@Service
public class MailServiceImpl implements IMailService {

    private final JavaMailSender mailSender;
    private final String mailFrom;
    private final String frontendUrl;

    public MailServiceImpl(JavaMailSender  mailSender,
                           @Value("${spring.mail.username}") String mailFrom,
                            @Value("${app.frontend-url}") String frontendUrl){
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
        this.frontendUrl = frontendUrl;
    }

    // slanje prostog maila tj slanje maila podrsci

    @Override
    public void sendSimpleMessage(String subject, String text, String... to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom(mailFrom);

        log.debug("Mejl za {} — {}\n{}", Arrays.toString(to), subject, text);

        try {
            mailSender.send(message);
            log.info("Mejl poslat na {}", Arrays.toString(to));
        } catch (Exception e) {
            log.error("Slanje mejla na {} nije uspelo", Arrays.toString(to), e);
        }
    }

    @Override
    public void sendResetPassword(String to, String userName, String token){
        String link = frontendUrl + "/reset-password?token=" + token;
        String subject = "Zahtev za promenu lozinke";
        String text = "Primili smo zahtev za promenu lozinke za nalog: " + userName + "\n\n"
                + "Klikni na link da postaviš novu lozinku:\n" + link + "\n\n"
                + "Link važi sat vremena. Ako nisi ti tražio promenu, slobodno zanemari ovu poruku.";
        sendSimpleMessage(subject, text, to);
    }

    //verifikacija maila
    public void sendVerificationEmail(String to, String token) {
        // Link za lokalni test
        String link = frontendUrl + "/verify?token=" + token;
        String subject = "Verify your account";
        String text = "Please click the link to verify your account:\n" + link;
        sendSimpleMessage(subject, text, to);
    }

    @Override
    public void sendOrderConfirmationEmail(String to, Order order) {
        String subject = "Plaćanje potvrđeno — porudžbina #" + order.getOrderID();

        StringBuilder text = new StringBuilder();
        text.append("Hvala na kupovini! Plaćanje je uspešno primljeno.\n\n");
        text.append("Broj porudžbine: ").append(order.getOrderID()).append("\n\n");
        text.append("Stavke:\n");

        for (OrderItem item : order.getOrderItems()) {
            text.append("- ").append(item.getWatch().getBrand()).append(" ").append(item.getWatch().getModel())
                    .append(" x").append(item.getAmount())
                    .append(" - ").append(item.getPrice()).append("€\n");
        }

        text.append("\nCena proizvoda: ").append(order.getTotalAmount()).append("€\n");
        text.append("Troškovi dostave: ").append(order.getShippingCost()).append("€\n");
        text.append("Ukupno: ").append(order.getTotalAmount() + order.getShippingCost()).append("€\n");

        sendSimpleMessage(subject, text.toString(), to);
    }

    // Za pravu verziju , stavlja se pravi domain:
    // String link = "https://mydomain.com/user/verify?token=" + token;
}

