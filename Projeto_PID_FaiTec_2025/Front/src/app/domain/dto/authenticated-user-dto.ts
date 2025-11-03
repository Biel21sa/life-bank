export interface AuthenticatedUserDto {
    email: string;
    token: string;
    role: string;
    id: string;
    donationLocationId?: string;
    donorId?: string;
}