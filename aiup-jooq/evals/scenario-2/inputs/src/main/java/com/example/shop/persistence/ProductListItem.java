package com.example.shop.persistence;

import java.math.BigDecimal;

public record ProductListItem(long id, String name, String category, BigDecimal price) {
}
