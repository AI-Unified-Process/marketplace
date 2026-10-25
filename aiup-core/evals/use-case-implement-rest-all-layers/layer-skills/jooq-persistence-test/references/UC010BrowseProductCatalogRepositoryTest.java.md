<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# UC010BrowseProductCatalogRepositoryTest.java

The source file `UC010BrowseProductCatalogRepositoryTest.java`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `UC010BrowseProductCatalogRepositoryTest.java`.

```java
package com.example.shop.product;

import java.math.BigDecimal;
import java.util.List;

import com.example.shop.TestcontainersConfiguration;
import com.example.shop.usecase.UseCase;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Persistence tests for UC-010 "Browse Product Catalog".
 * <p>
 * Expected values come from R__uc010_browse_product_catalog.sql and the specification, never from a run of the
 * code. The test data owns the ids 1001-1099 and the categories "UC010 …": five products, two of them out of stock.
 * Other use cases' test data shares the table, so every assertion is scoped to those rows.
 */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
@TestPropertySource(properties = "spring.flyway.locations=classpath:db/migration,classpath:db/testdata")
class UC010BrowseProductCatalogRepositoryTest {

    private static final int ALL = Integer.MAX_VALUE;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @UseCase(id = "UC-010")
    void finds_in_stock_products_ordered_by_name_with_all_fields() {
        List<ProductListItem> products = productRepository.findCatalog(new CatalogFilter(null), 0, ALL).stream()
                .filter(UC010BrowseProductCatalogRepositoryTest::ownedByThisTest)
                .toList();

        assertThat(products)
                .extracting(ProductListItem::name)
                .containsExactly("Desk Lamp", "Notebook", "Office Chair");
        assertThat(products.get(0))
                .isEqualTo(new ProductListItem(1001L, "Desk Lamp", "UC010 Lighting", new BigDecimal("39.90")));
    }

    // Only when persistence is the integration layer, or when nothing runs above it: otherwise the integration
    // layer's tests own the business rule.
    @Test
    @UseCase(id = "UC-010", businessRules = {"BR-001"})
    void never_returns_products_out_of_stock() {
        // "Floor Lamp" (1002) and "Standing Desk" (1005) are out of stock in the test data.
        assertThat(productRepository.findCatalog(new CatalogFilter(null), 0, ALL))
                .extracting(ProductListItem::id)
                .doesNotContain(1002L, 1005L);
        assertThat(productRepository.countCatalog(new CatalogFilter("UC010 Lighting"))).isEqualTo(1);
    }

    @Test
    @UseCase(id = "UC-010", scenario = "A1: Filter by Category")
    void filters_by_category() {
        List<ProductListItem> products = productRepository.findCatalog(new CatalogFilter("UC010 Office"), 0, 10);

        assertThat(products)
                .extracting(ProductListItem::name)
                .containsExactly("Notebook", "Office Chair");
    }

    @Test
    @UseCase(id = "UC-010", scenario = "A2: No Products Match Filter")
    void returns_no_product_for_a_category_without_products_in_stock() {
        assertThat(productRepository.findCatalog(new CatalogFilter("UC010 Desks"), 0, 10)).isEmpty();
        assertThat(productRepository.countCatalog(new CatalogFilter("UC010 Desks"))).isZero();
    }

    @Test
    @UseCase(id = "UC-010")
    void pages_through_the_catalog_in_name_order() {
        List<ProductListItem> secondPage = productRepository.findCatalog(new CatalogFilter("UC010 Office"), 1, 1);

        assertThat(secondPage)
                .extracting(ProductListItem::name)
                .containsExactly("Office Chair");
        assertThat(productRepository.countCatalog(new CatalogFilter("UC010 Office"))).isEqualTo(2);
    }

    private static boolean ownedByThisTest(ProductListItem product) {
        return product.id() >= 1001 && product.id() <= 1099;
    }
}
```
