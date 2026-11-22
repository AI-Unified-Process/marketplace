package com.example.hotel;

/**
 * A request that is well-formed but not allowed by a business rule.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
