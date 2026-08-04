package com.example.shop.generated.tables.pojos;

import java.math.BigDecimal;

/**
 * Generated jOOQ POJO for the PRODUCTS table.
 */
public class Product {

    private Long id;
    private Long categoryId;
    private String name;
    private BigDecimal price;
    private Integer stockQuantity;

    public Product() {}

    public Product(Long id, Long categoryId, String name, BigDecimal price, Integer stockQuantity) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
