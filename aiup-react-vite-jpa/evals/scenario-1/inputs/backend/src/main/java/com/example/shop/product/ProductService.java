package com.example.shop.product;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<ProductDto> findInStock(Optional<String> category) {
        List<Product> products = category
            .map(repository::findByInStockTrueAndCategory)
            .orElseGet(repository::findByInStockTrue);

        return products.stream()
            .map(p -> new ProductDto(p.getId(), p.getName(), p.getCategory(), p.getPrice()))
            .toList();
    }
}
