package com.example.hotel.guest;

public class EmailAlreadyRegisteredException extends BusinessRuleException {

    public EmailAlreadyRegisteredException(String email) {
        super("The email address " + email + " is already registered.");
    }
}
