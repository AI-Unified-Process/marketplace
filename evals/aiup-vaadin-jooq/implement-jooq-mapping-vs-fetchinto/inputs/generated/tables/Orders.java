package com.example.shop.generated.tables;

import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * Generated jOOQ table class for the ORDERS table.
 */
public class Orders extends TableImpl<com.example.shop.generated.tables.records.OrdersRecord> {

    public static final Orders ORDERS = new Orders();

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrdersRecord, Long> ID =
        createField(DSL.name("id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrdersRecord, Long> CUSTOMER_ID =
        createField(DSL.name("customer_id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrdersRecord, java.time.LocalDate> ORDER_DATE =
        createField(DSL.name("order_date"), SQLDataType.LOCALDATE.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.OrdersRecord, String> STATUS =
        createField(DSL.name("status"), SQLDataType.VARCHAR(50).nullable(false), this);

    private Orders() {
        super(DSL.name("orders"));
    }
}
