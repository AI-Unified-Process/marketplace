package com.example.shop.view;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.List;

@Route("catalog")
public class ProductCatalogView extends VerticalLayout {

    private final Grid<Product> productGrid = new Grid<>(Product.class, false);
    private final ComboBox<String> categoryFilter = new ComboBox<>("Category");

    public ProductCatalogView(ProductService productService) {
        productGrid.addColumn(Product::getName).setHeader("Name");
        productGrid.addColumn(Product::getCategory).setHeader("Category");
        productGrid.addColumn(Product::getStockStatus).setHeader("Stock Status");

        List<String> categories = productService.findAllCategories();
        categoryFilter.setItems(categories);
        categoryFilter.setClearButtonVisible(true);

        categoryFilter.addValueChangeListener(e -> {
            String selected = e.getValue();
            if (selected == null || selected.isBlank()) {
                productGrid.setItems(productService.findAll());
            } else {
                productGrid.setItems(productService.findByCategory(selected));
            }
        });

        productGrid.setItems(productService.findAll());
        add(categoryFilter, productGrid);
    }

    public record Product(Long id, String name, String category, String stockStatus) {
        public String getName() { return name; }
        public String getCategory() { return category; }
        public String getStockStatus() { return stockStatus; }
    }

    public interface ProductService {
        List<Product> findAll();
        List<Product> findByCategory(String category);
        List<String> findAllCategories();
    }
}
