package com.invictus.watches_final.exceptions.CustomExceptions;

public class PasswordPolicyException extends RuntimeException {
    public PasswordPolicyException(String message) {
        super(message);
    }
}
