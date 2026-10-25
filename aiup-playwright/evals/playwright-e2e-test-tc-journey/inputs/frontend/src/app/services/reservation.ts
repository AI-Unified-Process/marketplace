import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest, RoomType } from './reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    private readonly http = inject(HttpClient);

    list(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>('/api/reservations');
    }

    roomTypes(): Observable<RoomType[]> {
        return this.http.get<RoomType[]>('/api/room-types');
    }

    book(request: ReservationRequest): Observable<Reservation> {
        return this.http.post<Reservation>('/api/reservations', request);
    }
}
