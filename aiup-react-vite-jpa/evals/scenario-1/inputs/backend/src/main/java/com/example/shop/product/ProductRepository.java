package com.example.shop.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByInStockTrue();

    List<Product> findByInStockTrueAndCategory(String category);
}
