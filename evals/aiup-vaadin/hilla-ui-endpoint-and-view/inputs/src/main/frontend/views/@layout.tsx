import { AppLayout, SideNav, SideNavItem } from '@vaadin/react-components';
import { createMenuItems } from '@vaadin/hilla-file-router/runtime.js';
import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <AppLayout>
      <h1 slot="drawer">Hotel</h1>
      <SideNav slot="drawer">
        {createMenuItems().map(({ to, title }) => (
          <SideNavItem key={to} path={to}>
            {title}
          </SideNavItem>
        ))}
      </SideNav>
      <Outlet />
    </AppLayout>
  );
}
