package com.invictus.watches_final.security;

import com.invictus.watches_final.security.exceptions.ExpiredTokenException;
import com.invictus.watches_final.security.exceptions.InvalidTokenException;
import com.invictus.watches_final.services.CustomCredentialsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;


@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomCredentialsService customCredentialsService;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private static final Set<String> PUBLIC_ENDPOINTS = Set.of(
            "/user/login",
            "/user/register",
            "/watch/getAll",
            "/watch/filterWatches",
            "/watch/getOneWatch",
            "/store",
            "/request/sendRequest"
    ); //mora se dodati ostale funkcionalnosti

    @Autowired
    public JwtRequestFilter(JwtService jwtService,
                            CustomCredentialsService customCredentialsService,
                            JwtAuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtService = jwtService;
        this.customCredentialsService = customCredentialsService;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String servletPath = request.getServletPath();

        if (!PUBLIC_ENDPOINTS.contains(servletPath)) {

            String authHeader = request.getHeader("Authorization");

            try {
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    String username = jwtService.getUsernameFromToken(token);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = customCredentialsService.loadUserByUsername(username);

                        if (!jwtService.isTokenExpired(token) && jwtService.validateToken(token, userDetails)) {
                            UsernamePasswordAuthenticationToken authenticationToken =
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails, null, userDetails.getAuthorities()
                                    );

                            authenticationToken.setDetails(
                                    new WebAuthenticationDetailsSource().buildDetails(request)
                            );

                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        } else {
                            throw new ExpiredTokenException("Token expired, please login again.");
                        }
                    }

                } else {
                    throw new InvalidTokenException("Authorization header missing or invalid.");
                }

            } catch (ExpiredTokenException | InvalidTokenException e) {
                authenticationEntryPoint.commence(request, response, e);
                return;
            } catch (Exception e) {
                authenticationEntryPoint.commence(request, response,
                        new InvalidTokenException("Token validation error: " + e.getMessage()));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}

