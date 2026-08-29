package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.dto.AccountDTOs.*;
import com.invictus.watches_final.exceptions.CustomExceptions.InvalidCurrentPasswordException;
import com.invictus.watches_final.exceptions.CustomExceptions.NoUsersFoundException;
import com.invictus.watches_final.exceptions.CustomExceptions.PasswordPolicyException;
import com.invictus.watches_final.exceptions.CustomExceptions.UserNotFoundException;
import com.invictus.watches_final.mapper.UserInfoMapper;
import com.invictus.watches_final.model.Cart;
import com.invictus.watches_final.model.User;
import com.invictus.watches_final.repository.CartRepo;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.security.enums.Roles;
import com.invictus.watches_final.security.exceptions.InvalidTokenException;
import com.invictus.watches_final.services.IServices.IMailService;
import com.invictus.watches_final.services.IServices.IUserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepo repo;
    private final CartRepo cartRepo;
    private final PasswordEncoder passwordEncoder;
    private final IMailService mailService;


    @Override
    public UUID getUserIDByUserName(String userName) {

        if(userName == null || userName.isBlank()){
            throw new IllegalArgumentException("Username must not be empty");
        }

        return repo.findByUserName(userName).map(User::getUserID)
                .orElseThrow(()->new UsernameNotFoundException("Username" + userName + "not found"));
    }

    @Override
    public UserInfoDTO getUserInfoByUserName(String userName) {
        if(userName == null || userName.isBlank()){
            throw new IllegalArgumentException("Username must not be empty");
        }
            User user = repo.findByUserName(userName)
                .orElseThrow(()->new UsernameNotFoundException("Username" + userName + "not found"));

        return UserInfoMapper.entityToDTO(user);
    }

    @Override
    public Page<UserInfoDTO> getAllUsers(Pageable pageable) {
        Page<UserInfoDTO> users = repo.findAll(pageable).map(UserInfoMapper::entityToDTO);

        if(users.isEmpty()){
            throw new NoUsersFoundException("No users found");
        }
        return users;
    }

    @Override
    public List<UserInfoDTO> getAllUsersList() {
        List<UserInfoDTO> users =  repo.findAll()
                .stream().map(UserInfoMapper::entityToDTO).toList();

        if(users.isEmpty()){
            throw new NoUsersFoundException("Username not found");
        }

            return users;
    }

    @Override
    public UserInfoDTO updateUser(UUID userID, UpdateProfilDTO userDTO) {
        User user = repo.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setFullName(userDTO.getFullName());
        user.setPhone(userDTO.getPhone());

        repo.save(user);

        return  UserInfoMapper.entityToDTO(user);

    }

    @Transactional
    @Override
    public UserInfoDTO registerUser(RegisterDTO registerDTO) {
        if(repo.findByUserName(registerDTO.getUserName()).isPresent()){
            throw new IllegalArgumentException("Username already exists");
        }

        if(repo.findByEmail(registerDTO.getEmail()).isPresent()){
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setFullName(registerDTO.getFullName());
        user.setUserName(registerDTO.getUserName());
        user.setPhone(registerDTO.getPhone());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail());
        user.setRole(Roles.USER_ROLE);
        user.setRegistrationDate(LocalDateTime.now());

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        user.setVerified(false);

        User savedUser = repo.save(user);

        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepo.save(cart);

        mailService.sendVerificationEmail(savedUser.getEmail(), token);

        return  UserInfoMapper.entityToDTO(savedUser);
    }

    @Override
    public void verifyEmail(String token){
        User user = repo.findUserByVerificationToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));

        if (user.getVerificationTokenExpiry() != null &&
                user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Verification token has expired");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        repo.save(user);
    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        if (user.isVerified()) {
            throw new IllegalStateException("User is already verified");
        }

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        repo.save(user);

        mailService.sendVerificationEmail(user.getEmail(), token);
    }

    @Override
    public void forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
        User user = repo.findByEmail(forgotPasswordDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
        repo.save(user);

        mailService.sendResetPassword(forgotPasswordDTO.getEmail(), user.getUserName(), token);
    }

    @Override
    public void resetPassword(ResetPasswordWithTokenDTO resetPasswordWithTokenDTO) {
        User user = repo.findByResetPasswordToken(resetPasswordWithTokenDTO.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid token"));

        if(user.getResetPasswordTokenExpiry() == null
        || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())){
            throw new InvalidTokenException("Token has expired");
        }

        if(!resetPasswordWithTokenDTO.getNewPassword().equals(resetPasswordWithTokenDTO.getConfirmNewPassword())){
            throw new PasswordPolicyException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(resetPasswordWithTokenDTO.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        repo.save(user);

        String subject = "Password Reset Successfully";
        String text = "Hello " + user.getFullName() + ",\n\nYour password has been successfully reset.\n";
        mailService.sendSimpleMessage(subject, text, user.getEmail());
    }


    @Override
    public void changePassword(String userName, ChangePasswordDTO changePasswordDTO) {
        User user = repo.findByUserName(userName)
                .orElseThrow(()->new UsernameNotFoundException("Username not found"));

        if(!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())){
            throw new InvalidCurrentPasswordException("Current password is not correct");
        }

        if(passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPassword())){
            throw new PasswordPolicyException("New password must be different from the current password");
        }

        if (changePasswordDTO.getConfirmNewPassword() != null &&
                !changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmNewPassword())) {
            throw new PasswordPolicyException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        user.setPasswordChangedAt(LocalDateTime.now());
        repo.save(user);

        String subject = "Password Changed Successfully";
        String text = "Hello " + user.getFullName() + ",\n\n" +
                "Your password has been successfully changed.\n";

        mailService.sendSimpleMessage(subject, text, user.getEmail());

    }

    @Override
    public boolean checkIfAdmin(String username) {
        return repo.findByUserName(username)
                .map(user -> user.getRole() == Roles.ADMIN_ROLE)
                .orElse(false);
    }
}
