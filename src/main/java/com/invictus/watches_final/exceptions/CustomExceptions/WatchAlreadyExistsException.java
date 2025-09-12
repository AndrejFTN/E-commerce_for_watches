package com.invictus.watches_final.exceptions.CustomExceptions;

public class WatchAlreadyExistsException extends RuntimeException {
    public WatchAlreadyExistsException(String message) {
        super(message);
    }
}
