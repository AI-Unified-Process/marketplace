// Mirrors GuestDto / GuestRequest of the API layer.
export interface Guest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface GuestRequest {
    firstName: string;
    lastName: string;
    email: string;
}
