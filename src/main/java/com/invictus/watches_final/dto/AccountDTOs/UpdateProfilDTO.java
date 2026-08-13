package com.invictus.watches_final.dto.AccountDTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfilDTO {

    @Pattern(regexp = "^\\+?\\d{6,15}$", message = "Phone must be digits, optionally starting with +, and 6–15 characters long")
    @NotBlank
    private String phone;

    @Pattern(
            regexp = "^[A-Za-zšđčćžŠĐČĆŽ'\\- ]+$",
            message = "Full name must contain only letters and spaces"
    )
    @NotBlank
    private String fullName;
}
