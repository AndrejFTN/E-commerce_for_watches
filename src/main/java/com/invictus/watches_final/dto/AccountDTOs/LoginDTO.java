package com.invictus.watches_final.dto.AccountDTOs;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginDTO {

    @NotBlank
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    private String userName;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
