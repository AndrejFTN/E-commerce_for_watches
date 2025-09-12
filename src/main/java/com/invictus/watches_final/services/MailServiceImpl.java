package com.invictus.watches_final.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Properties;

@Service
public class MailServiceImpl implements IMailService{

    // konfiguriacija
    private static final String MAIL_FROM = "satoviinvictus@outlook.com"; // tvoj admin mail
    private final JavaMailSenderImpl mailSender;

    public MailServiceImpl() {
        mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp-mail.outlook.com");
        mailSender.setPort(587);
        mailSender.setUsername(MAIL_FROM);
        mailSender.setPassword("Uwj73J57PKXCWsK"); // koristi se password od admina
        mailSender.setJavaMailProperties(getMailProperties());
    }

    private Properties getMailProperties() {
        Properties prop = new Properties();
        prop.setProperty("mail.smtp.auth", "true");
        prop.setProperty("mail.smtp.starttls.enable", "true");
        prop.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");
        prop.setProperty("mail.smtp.ssl.trust", "smtp-mail.outlook.com");
        return prop;
    }


    // slanje prostog maila tj slanje maila podrsci

    @Override
    public void sendSimpleMessage(String subject, String text, String... to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom(MAIL_FROM);


        //local test

        System.out.println("Email to: " + Arrays.toString(to));
        System.out.println("Subject: " + subject);
        System.out.println("Text: " + text);


        //pravo slanje
        // mailSender.send(message);
    }

    //verifikacija maila
    public void sendVerificationEmail(String to, String token) {
        // Link za lokalni test
        String link = "http://localhost:8080/user/verify?token=" + token;
        String subject = "Verify your account";
        String text = "Please click the link to verify your account:\n" + link;

        sendSimpleMessage(subject, text, to);
    }

    // Za pravu verziju , stavlja se pravi domain:
    // String link = "https://mydomain.com/user/verify?token=" + token;
}

