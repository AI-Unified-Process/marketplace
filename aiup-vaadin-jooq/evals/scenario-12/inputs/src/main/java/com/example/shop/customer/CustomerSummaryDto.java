package com.example.shop.customer;

import com.vaadin.hilla.Nonnull;

public record CustomerSummaryDto(long id, @Nonnull String name, @Nonnull String email) {}
