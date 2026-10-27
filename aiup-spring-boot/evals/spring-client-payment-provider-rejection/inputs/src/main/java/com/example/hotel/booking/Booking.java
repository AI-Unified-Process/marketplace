package com.example.hotel.booking;

import java.math.BigDecimal;

public record Booking(Long id, String guestName, BigDecimal totalPrice, String currency, String cardToken,
                      String depositChargeId, boolean depositPaid) {
}
