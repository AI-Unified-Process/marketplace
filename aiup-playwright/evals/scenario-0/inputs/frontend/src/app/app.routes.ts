import { Routes } from '@angular/router';
import { BookRoom } from './pages/book-room/book-room';
import { Guests } from './pages/guests/guests';
import { RegisterGuest } from './pages/register-guest/register-guest';
import { Reservations } from './pages/reservations/reservations';

export const routes: Routes = [
    { path: 'guests', component: Guests },
    { path: 'guests/new', component: RegisterGuest },
    { path: 'reservations', component: Reservations },
    { path: 'reservations/new', component: BookRoom },
    { path: '', pathMatch: 'full', redirectTo: 'guests' },
];
