package com.invictus.watches_final.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ApiError {

    private int status;
    private String message;
    private LocalDateTime timestamp;
}
