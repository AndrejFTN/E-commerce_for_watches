package com.invictus.watches_final.dto.AccountDTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterDTO {

    @NotBlank
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    private String userName;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
    )
    private String password;

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
}
