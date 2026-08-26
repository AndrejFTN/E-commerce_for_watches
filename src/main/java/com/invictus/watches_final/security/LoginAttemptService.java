package com.invictus.watches_final.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION_MINUTES = 15;

    private final ConcurrentHashMap<String, AttemptInfo> attempts = new ConcurrentHashMap<>();

    public void loginFailed(String login) {
        AttemptInfo info = attempts.computeIfAbsent(login, k -> new AttemptInfo());
        info.count++;
        info.lastFailedAttempt = Instant.now();

        if (info.count == MAX_ATTEMPTS) {
            log.warn("Nalog '{}' privremeno blokiran posle {} neuspelih prijava",
                    login, MAX_ATTEMPTS);
        }
    }

    public void loginSucceeded(String login) {
        attempts.remove(login);
    }

    public boolean isBlocked(String login) {
        AttemptInfo info = attempts.get(login);
        if (info == null || info.count < MAX_ATTEMPTS) {
            return false;
        }

        boolean stillLocked = Instant.now().isBefore(
                info.lastFailedAttempt.plusSeconds(LOCKOUT_DURATION_MINUTES * 60)
        );

        if (!stillLocked) {
            attempts.remove(login);
            return false;
        }

        return true;
    }

        private static class AttemptInfo {
            int count = 0;
            Instant lastFailedAttempt;
        }
}
