package com.invictus.watches_final.services;


import com.invictus.watches_final.dto.AccountDTOs.RequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class RequestServiceImpl implements IRequestService {

    private final MailServiceImpl mailService;

    public String sendRequest(RequestDTO requestDTO) {
        String subject = "New Request: " + requestDTO.getSubject();
        String text = "New Request from [name]: " + requestDTO.getName() + " [email]: " + requestDTO.getEmail() +
                System.lineSeparator() + System.lineSeparator() + requestDTO.getText();

        mailService.sendSimpleMessage(subject, text, "satoviinvictus@outlook.com");
        return "Request successful send";
    }
}