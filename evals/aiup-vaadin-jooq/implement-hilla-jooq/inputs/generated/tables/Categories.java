package com.example.shop.generated.tables;

import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

/**
 * Generated jOOQ table class for the CATEGORIES table.
 */
public class Categories extends TableImpl<com.example.shop.generated.tables.records.CategoriesRecord> {

    public static final Categories CATEGORIES = new Categories();

    public final org.jooq.TableField<com.example.shop.generated.tables.records.CategoriesRecord, Long> ID =
        createField(DSL.name("id"), SQLDataType.BIGINT.nullable(false), this);

    public final org.jooq.TableField<com.example.shop.generated.tables.records.CategoriesRecord, String> NAME =
        createField(DSL.name("name"), SQLDataType.VARCHAR(255).nullable(false), this);

    private Categories() {
        super(DSL.name("categories"));
    }
}
