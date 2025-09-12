package com.invictus.watches_final.services;

import com.invictus.watches_final.dto.AccountDTOs.ChangePasswordDTO;
import com.invictus.watches_final.dto.AccountDTOs.RegisterDTO;
import com.invictus.watches_final.dto.AccountDTOs.UserInfoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IUserService {

    UUID getUserIDByUserName(String userName);

    UserInfoDTO getUserInfoByUserName(String userName);

    Page<UserInfoDTO> getAllUsers (Pageable pageable);

    List<UserInfoDTO> getAllUsersList();

    UserInfoDTO registerUser(RegisterDTO registerDTO);

    boolean checkIfAdmin(String username);

    UserInfoDTO updateUser(UUID userID, UserInfoDTO userDTO);

    boolean changePassword(String userName, ChangePasswordDTO  changePasswordDTO);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);
}
