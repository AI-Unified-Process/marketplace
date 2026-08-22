package com.example.shop.order;

import java.time.LocalDateTime;

public record OrderDto(Long id, Long customerId, OrderStatus status, LocalDateTime placedAt,
                       LocalDateTime cancelledAt) {
}
