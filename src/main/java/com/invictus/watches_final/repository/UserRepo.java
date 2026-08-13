package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {

    Optional<User> findByUserName(String userName); // mozda greska zbog malih i velikih slova

    Optional<User> findByEmail(String email);

    Optional<User> findUserByVerificationToken(String verificationToken);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}
