package com.invictus.watches_final.services.ServiceImpl;

import com.invictus.watches_final.model.User;
import com.invictus.watches_final.repository.UserRepo;
import com.invictus.watches_final.security.enums.Roles;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@AllArgsConstructor
public class CustomCredentialsService implements UserDetailsService {

    private final UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User userCredentials = repo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with" + username + " username not found"));

        Roles role = userCredentials.getRole();

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role.name());

        return new org.springframework.security.core.userdetails.User( // nesto baguje i samo ovako prihvata rezultat
            userCredentials.getUserName(),
            userCredentials.getPassword(),
                Collections.singleton(authority)
        );
    }
}
