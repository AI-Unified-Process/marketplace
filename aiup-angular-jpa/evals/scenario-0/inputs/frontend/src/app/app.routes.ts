import { Routes } from '@angular/router';
import { ProductCatalog } from './pages/product-catalog/product-catalog';

export const routes: Routes = [
    { path: 'products', component: ProductCatalog },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products' },
];
