package com.invictus.watches_final.services.IServices;

import com.invictus.watches_final.dto.AccountDTOs.*;
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

    UserInfoDTO updateUser(UUID userID, UpdateProfilDTO userDTO);

    void changePassword(String userName, ChangePasswordDTO  changePasswordDTO);

    void verifyEmail(String token);

    void resendVerificationEmail(String email);

    void forgotPassword(ForgotPasswordDTO forgotPasswordDTO);

    void resetPassword(ResetPasswordWithTokenDTO resetPasswordWithTokenDTO);
}
