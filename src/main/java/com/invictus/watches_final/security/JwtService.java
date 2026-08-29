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

    private static final long JWT_TOKEN_VALIDITY = 120 * 60 * 1000;
    @Value("${secret}")
    private String secret;


    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(username, claims);
    }


    private String doGenerateToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // username
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }


    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }


    public Date getExpirationDateFromToken(String token) {
        return getAllClaimsFromToken(token).getExpiration();
    }


    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }


    public boolean isTokenExpired(String token) throws ExpiredJwtException {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }


    public boolean validateToken(String token, UserDetails userDetails) throws ExpiredJwtException {
        String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    public Date getIssuedAtDateFromToken(String token) {
        return getAllClaimsFromToken(token).getIssuedAt();
    }
}
