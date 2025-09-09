export interface AuthenticatedUserDto {
    email: string;
    password: string;
    role: string;
    donationLocationId?: string;
}