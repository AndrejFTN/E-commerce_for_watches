package com.invictus.watches_final.model;

import com.invictus.watches_final.security.enums.Roles;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class User {


//    @GeneratedValue(generator = "uuid2")
//    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID userID;

    @Column(unique = true, nullable = false)
    private String userName;
    private String password;
    @Enumerated(EnumType.STRING)
    private Roles role;

    private boolean isVerified = false;
    private LocalDateTime passwordChangedAt;
    private String verificationToken;
    private LocalDateTime verificationTokenExpiry;
    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    private String phone;
    private String fullName;
    @Column(unique = true, nullable = false)
    private String email;


}
