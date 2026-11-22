package com.example.shop.generated.tables;

import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * Generated jOOQ table class for the PRODUCTS table.
 */
public class Products extends TableImpl<com.example.shop.generated.tables.records.ProductsRecord> {

    public static final Products PRODUCTS = new Products();

    public final org.jooq.TableField<com.example.shop.generated.tables.records.ProductsRecord, Long> ID =
        createField(DSL.name("id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.ProductsRecord, Long> CATEGORY_ID =
        createField(DSL.name("category_id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.ProductsRecord, String> NAME =
        createField(DSL.name("name"), SQLDataType.VARCHAR(255).nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.ProductsRecord, java.math.BigDecimal> PRICE =
        createField(DSL.name("price"), SQLDataType.NUMERIC(10, 2).nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.ProductsRecord, Integer> STOCK_QUANTITY =
        createField(DSL.name("stock_quantity"), SQLDataType.INTEGER.nullable(false), this);

    private Products() {
        super(DSL.name("products"));
    }
}
