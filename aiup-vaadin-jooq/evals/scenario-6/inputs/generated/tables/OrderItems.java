package com.example.shop.generated.tables;

import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * Generated jOOQ table class for the ORDER_ITEMS table.
 */
public class OrderItems extends TableImpl<com.example.shop.generated.tables.records.OrderItemsRecord> {

    public static final OrderItems ORDER_ITEMS = new OrderItems();

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrderItemsRecord, Long> ID =
        createField(DSL.name("id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrderItemsRecord, Long> ORDER_ID =
        createField(DSL.name("order_id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrderItemsRecord, Long> PRODUCT_ID =
        createField(DSL.name("product_id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrderItemsRecord, Integer> QUANTITY =
        createField(DSL.name("quantity"), SQLDataType.INTEGER.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrderItemsRecord, java.math.BigDecimal> UNIT_PRICE =
        createField(DSL.name("unit_price"), SQLDataType.DECIMAL(10, 2).nullable(false), this);

    private OrderItems() {
        super(DSL.name("order_items"));
    }
}
