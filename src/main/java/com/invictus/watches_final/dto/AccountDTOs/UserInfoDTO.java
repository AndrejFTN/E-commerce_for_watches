package com.invictus.watches_final.dto.AccountDTOs;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {

    @NotBlank
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    private String userName;
    @Pattern(regexp = "^\\+?\\d{6,15}$", message = "Phone must be digits, optionally starting with +, and 6–15 characters long")
    @NotBlank
    private String phone;
    @Email(message = "email format is invalid")
    @NotBlank(message = "email is required")
    private String email;
    @Pattern(
            regexp = "^[A-Za-zšđčćžŠĐČĆŽ'\\- ]+$",
            message = "Full name must contain only letters and spaces"
    )
    @NotBlank
    private String fullName;


    private boolean isVerified = false;
    private LocalDateTime registrationDate;
}
