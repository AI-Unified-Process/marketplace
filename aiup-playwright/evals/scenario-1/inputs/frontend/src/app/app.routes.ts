import { Routes } from '@angular/router';
import { Guests } from './pages/guests/guests';
import { RegisterGuest } from './pages/register-guest/register-guest';

export const routes: Routes = [
    { path: 'guests', component: Guests },
    { path: 'guests/new', component: RegisterGuest },
    { path: '', pathMatch: 'full', redirectTo: 'guests' },
];
