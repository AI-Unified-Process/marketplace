package com.example.shop.generated.tables.pojos;

import java.time.LocalDate;

/**
 * Generated jOOQ POJO for the ORDERS table.
 */
public class Order {

    private Long id;
    private Long customerId;
    private LocalDate orderDate;
    private String status;

    public Order() {}

    public Order(Long id, Long customerId, LocalDate orderDate, String status) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
