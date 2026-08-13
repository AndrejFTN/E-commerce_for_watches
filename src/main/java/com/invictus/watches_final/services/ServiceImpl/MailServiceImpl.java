package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.services.IServices.IMailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Arrays;


@Service
public class MailServiceImpl implements IMailService {

    private final JavaMailSender mailSender;
    private final String mailFrom;

    public MailServiceImpl(JavaMailSender  mailSender,
                           @Value("${spring.mail.username}") String mailFrom) {
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    // slanje prostog maila tj slanje maila podrsci

    @Override
    public void sendSimpleMessage(String subject, String text, String... to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom(mailFrom);


        //local test

        System.out.println("Email to: " + Arrays.toString(to));
        System.out.println("Subject: " + subject);
        System.out.println("Text: " + text);


        //pravo slanje
        // mailSender.send(message);
    }

    public void sendResetPassword(String to, String token){
        String link = "http://localhost:9002/reset-password?token=" + token;
        String subject = "Reset your password";
        String text = "Click the link to reset your password:\n" + link;
        sendSimpleMessage(subject, text, to);
    }

    //verifikacija maila
    public void sendVerificationEmail(String to, String token) {
        // Link za lokalni test
        String link = "http://localhost:9002/user/verify?token=" + token;
        String subject = "Verify your account";
        String text = "Please click the link to verify your account:\n" + link;
        sendSimpleMessage(subject, text, to);
    }

    // Za pravu verziju , stavlja se pravi domain:
    // String link = "https://mydomain.com/user/verify?token=" + token;
}

