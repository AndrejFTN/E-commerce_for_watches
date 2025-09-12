package com.invictus.watches_final.dto.AccountDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestDTO {

    @NotBlank(message = "Name must not be empty")
    private String name;

    @NotBlank(message = "Email must not be empty")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Subject must not be empty")
    @Size(max = 100, message = "Subject cannot be longer than 100 characters")
    private String subject;

    @NotBlank(message = "Message must not be empty")
    @Size(max = 1000, message = "Message cannot be longer than 1000 characters")
    private String text;
}
