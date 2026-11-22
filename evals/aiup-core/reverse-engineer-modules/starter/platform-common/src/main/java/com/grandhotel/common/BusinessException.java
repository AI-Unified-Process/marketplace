package com.grandhotel.common;

/** Thrown when a request violates a business rule; mapped to 409 by RestExceptionHandler. */
public class BusinessException extends RuntimeException {

    private final String code;

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String code() {
        return code;
    }
}
