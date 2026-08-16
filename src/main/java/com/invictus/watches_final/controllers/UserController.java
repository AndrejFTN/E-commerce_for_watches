package com.invictus.watches_final.controllers;

import com.invictus.watches_final.dto.AccountDTOs.*;
import com.invictus.watches_final.security.JwtService;
import com.invictus.watches_final.security.LoginAttemptService;
import com.invictus.watches_final.services.IServices.IUserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;


import java.util.UUID;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private final IUserService service;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginAttemptService loginAttemptService;

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserInfoDTO> register (@Valid @RequestBody RegisterDTO registerDTO) {
        UserInfoDTO registeredUser = service.registerUser(registerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
    }

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponseDTO> login (@Valid @RequestBody LoginDTO loginDTO) {
        if (loginAttemptService.isBlocked(loginDTO.getUserName())) {
            throw new LockedException("Too many failed login attempts. Try again in a few minutes.");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUserName(), loginDTO.getPassword())
            );
        } catch (AuthenticationException e) {
            loginAttemptService.loginFailed(loginDTO.getUserName());
            throw e;
        }

        loginAttemptService.loginSucceeded(loginDTO.getUserName());

        String token =  jwtService.generateToken(loginDTO.getUserName());

        AuthResponseDTO response = new AuthResponseDTO(token);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PutMapping(path = "/resetPassword")
    public ResponseEntity<String> resetPassword (Authentication authentication,
                                                  @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        service.changePassword(authentication.getName(), changePasswordDTO);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping(path = "/forgotPassword", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> forgotPassword (@Valid @RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        service.forgotPassword(forgotPasswordDTO);
        return ResponseEntity.ok("Password reset email sent");
    }

    @PutMapping(path = "/resetPasswordWithToken", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> resetPasswordWithtoken(@Valid @RequestBody ResetPasswordWithTokenDTO resetPasswordWithTokenDTO) {
        service.resetPassword(resetPasswordWithTokenDTO);
        return ResponseEntity.ok("Password reset successfully");
    }

    @GetMapping(path = "/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        service.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully");
    }

    @PostMapping(path = "/resendEmail")
    public ResponseEntity<String> resendEmail(@RequestParam String email) {
        service.resendVerificationEmail(email);
        return ResponseEntity.ok("Email resend successfully");
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping(path="/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(service.getAllUsersList()); // u servisu smo radili proveru
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping(path="/getAllPage")
    public ResponseEntity<?> getAllUsers(Pageable pageable){
        return ResponseEntity.ok(service.getAllUsers(pageable));
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping(path="/getUserId/{userName}")
    public ResponseEntity<UUID> getUserIDByUserName(@PathVariable String userName){
            UUID userID = service.getUserIDByUserName(userName);
            return ResponseEntity.ok(userID);
    }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping(path="/getUserInfo/{userName}")
    public ResponseEntity<UserInfoDTO> getUserInfoByUserName(@PathVariable String userName){
            UserInfoDTO userInfoDTO = service.getUserInfoByUserName(userName);
            return ResponseEntity.ok(userInfoDTO);
            }

    @PreAuthorize("hasAuthority('ADMIN_ROLE')")
    @GetMapping("/checkIfAdmin")
    public ResponseEntity<Boolean> checkIfAdmin(Authentication authentication){
        String username = authentication.getName(); // iz security context-a
        boolean isAdmin = service.checkIfAdmin(username);
        return ResponseEntity.ok(isAdmin);
    }


    @PreAuthorize("hasAnyAuthority('USER_ROLE','ADMIN_ROLE')")
    @PutMapping(path="/updateUser/{userID}")
    public ResponseEntity<UserInfoDTO> updateUser(@PathVariable UUID userID, @Valid @RequestBody UpdateProfilDTO userDTO){
            UserInfoDTO updatedUserDTO = service.updateUser(userID, userDTO);
            return ResponseEntity.ok(updatedUserDTO);
    }

}
