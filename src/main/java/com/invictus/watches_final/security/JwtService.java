package com.invictus.watches_final.security;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtService {

    // Vreme važenja tokena: 2 sata
    private static final long JWT_TOKEN_VALIDITY = 120 * 60 * 1000; //moguce izmene da nema isteka kada se loguje

    @Value("${secret}")
    private String secret;

    // Generiše token samo sa username
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(username, claims);
    }

    // Privatna metoda koja pravi token
    private String doGenerateToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims) // ovde je prazno jer ne čuvam role
                .setSubject(subject) // username
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    // Vraća username iz tokena
    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    // Vraća datum isteka tokena
    public Date getExpirationDateFromToken(String token) {
        return getAllClaimsFromToken(token).getExpiration();
    }

    // Privatna metoda za čitanje svih claim-ova
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    //  Provera da li je token istekao
    public boolean isTokenExpired(String token) throws ExpiredJwtException {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // Validacija tokena
    public boolean validateToken(String token, UserDetails userDetails) throws ExpiredJwtException {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    //Vraca vreme izdavanja tokena
    public Date getIssuedAtDateFromToken(String token) {
        return getAllClaimsFromToken(token).getIssuedAt();
    }
}
