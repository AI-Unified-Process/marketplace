package com.example.shop.product;

import java.math.BigDecimal;

public record ProductDto(Long id, String name, String category, BigDecimal price) {
}
