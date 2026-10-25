// Mirrors ReservationDto / ReservationRequest / RoomTypeDto of the API layer.
export interface Reservation {
    id: number;
    guestId: number;
    guestName: string;
    roomTypeName: string;
    arrival: string;
    departure: string;
}

export interface ReservationRequest {
    guestId: number;
    roomTypeId: number;
    arrival: string;
    departure: string;
}

export interface RoomType {
    id: number;
    name: string;
}
