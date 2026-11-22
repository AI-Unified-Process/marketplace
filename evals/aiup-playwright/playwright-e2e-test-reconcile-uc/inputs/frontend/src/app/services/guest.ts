import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest, GuestRequest } from './guest.model';

@Injectable({ providedIn: 'root' })
export class GuestService {
    private readonly http = inject(HttpClient);

    list(): Observable<Guest[]> {
        return this.http.get<Guest[]>('/api/guests');
    }

    register(request: GuestRequest): Observable<Guest> {
        return this.http.post<Guest>('/api/guests', request);
    }
}
