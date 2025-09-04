import { DonationLocation } from "./donation-location";
import { UserRole } from "./user-role";

export interface User {
    id?: string,
    name: string,
    role: UserRole,
    cpf: string,
    email: string,
    phone: string,
    password: string,
    street: string,
    number: string,
    neighborhood: string,
    postalCode: string,
    donationLocationId?: string,
    donationLocation: DonationLocation,
    bloodType?: string,
    nameClinic?: string,
    cnpj?: string
}
