package com.example.hotel.guest;

public class GuestTooYoungException extends BusinessRuleException {

    public GuestTooYoungException() {
        super("Guests must be at least 18 years old on the day of arrival.");
    }
}
