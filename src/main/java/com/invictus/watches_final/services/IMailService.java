package com.invictus.watches_final.services;

public interface IMailService {
    void sendSimpleMessage(String subject, String text, String... to);
    void sendVerificationEmail(String to, String token);
}
