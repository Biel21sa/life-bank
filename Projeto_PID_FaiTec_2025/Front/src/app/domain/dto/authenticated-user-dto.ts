export interface AuthenticatedUserDto {
    email: string;
    password: string;
    role: string;
    id: string;
    donationLocationId?: string;
}