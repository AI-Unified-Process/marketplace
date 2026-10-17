package com.example.shop.persistence;

import java.util.List;

import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Records;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import static com.example.shop.db.Tables.PRODUCT;

@Repository
public class ProductRepository {

    private final DSLContext ctx;

    public ProductRepository(DSLContext ctx) {
        this.ctx = ctx;
    }

    public List<ProductListItem> findCatalog(String category, int offset, int limit) {
        return ctx.select(PRODUCT.ID, PRODUCT.NAME, PRODUCT.CATEGORY, PRODUCT.PRICE)
                .from(PRODUCT)
                .where(catalogConditions(category))
                .orderBy(PRODUCT.NAME)
                .offset(offset)
                .limit(limit)
                .fetch(Records.mapping(ProductListItem::new));
    }

    public int countCatalog(String category) {
        return ctx.fetchCount(PRODUCT, catalogConditions(category));
    }

    private Condition catalogConditions(String category) {
        Condition condition = DSL.noCondition();
        if (category != null) {
            condition = condition.and(PRODUCT.CATEGORY.eq(category));
        }
        // UC-010 BR-001: Products that are not in stock never appear in the catalog.
        return condition.and(PRODUCT.IN_STOCK.isTrue());
    }
}
