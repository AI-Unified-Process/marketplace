import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest, GuestRequest } from './guest.model';

@Injectable({ providedIn: 'root' })
export class GuestService {
    private readonly http = inject(HttpClient);

    register(request: GuestRequest): Observable<Guest> {
        return this.http.post<Guest>('/api/guests', request);
    }
}
