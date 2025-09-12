package com.invictus.watches_final.security.exceptions;

import org.springframework.security.core.AuthenticationException;

public class ExpiredTokenException extends AuthenticationException {
    public ExpiredTokenException(String msg) {
        super(msg);
    }
}
