package com.example.shop.view;

import com.example.shop.order.OrderDto;
import com.example.shop.order.OrderRepository;
import com.example.shop.order.OrderStatus;
import com.example.shop.security.CurrentCustomer;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("orders")
public class OrderListView extends VerticalLayout {

    private final OrderRepository orders;
    private final CurrentCustomer currentCustomer;
    private final Grid<OrderDto> grid = new Grid<>(OrderDto.class, false);

    public OrderListView(OrderRepository orders, CurrentCustomer currentCustomer) {
        this.orders = orders;
        this.currentCustomer = currentCustomer;

        grid.addColumn(OrderDto::id).setHeader("Order");
        grid.addColumn(order -> order.status().name()).setHeader("Status");
        grid.addComponentColumn(this::cancelButton).setHeader("");
        grid.addComponentColumn(this::reorderButton).setHeader("");

        add(grid);
        refresh();
    }

    private void refresh() {
        grid.setItems(orders.findByCustomer(currentCustomer.id()));
    }

    private Button cancelButton(OrderDto order) {
        Button cancel = new Button("Cancel order", event -> onCancel(order));
        cancel.setId("cancel-" + order.id());
        return cancel;
    }

    private Button reorderButton(OrderDto order) {
        Button reorder = new Button("Reorder", event -> {
            Notification.show("Order placed again");
            refresh();
        });
        reorder.setId("reorder-" + order.id());
        return reorder;
    }

    private void onCancel(OrderDto order) {
        if (order.status() == OrderStatus.SHIPPED) {
            Notification.show("Shipped orders cannot be cancelled");
            return;
        }

        ConfirmDialog dialog = new ConfirmDialog();
        dialog.setHeader("Cancel order");
        dialog.setText("Do you really want to cancel this order?");
        dialog.setCancelable(true);
        dialog.setConfirmText("Cancel order");
        dialog.addConfirmListener(event -> {
            orders.cancel(order.id());
            Notification.show("Order cancelled");
            refresh();
        });
        dialog.open();
    }
}
