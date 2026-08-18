package com.invictus.watches_final.repository;

import com.invictus.watches_final.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {

    Optional<User> findByUserName(String userName); // mozda greska zbog malih i velikih slova

    Optional<User> findByEmail(String email);

    Optional<User> findUserByVerificationToken(String verificationToken);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isVerified = :verified")
    long countByVerified(@Param("verified") boolean verified);

    long countByRegistrationDateAfter(LocalDateTime date);



}
