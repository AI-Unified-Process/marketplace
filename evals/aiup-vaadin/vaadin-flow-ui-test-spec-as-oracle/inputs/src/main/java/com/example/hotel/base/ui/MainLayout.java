package com.example.hotel.base.ui;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.sidenav.SideNav;
import com.vaadin.flow.router.Layout;
import com.vaadin.flow.server.menu.MenuConfiguration;
import com.vaadin.flow.component.sidenav.SideNavItem;

import jakarta.annotation.security.PermitAll;

@Layout
@PermitAll
public class MainLayout extends AppLayout {

    public MainLayout() {
        SideNav nav = new SideNav();
        MenuConfiguration.getMenuEntries().forEach(entry -> nav.addItem(new SideNavItem(entry.title(), entry.path())));
        addToDrawer(new H1("Hotel"), nav);
    }
}
