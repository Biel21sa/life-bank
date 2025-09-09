import { DonationLocation } from "./donation-location";
import { Donor } from "./donor";
import { Municipality } from "./municipality";
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
    municipalityId?: string,
    municipality?: Municipality,
    donationLocationId?: string,
    donationLocation?: DonationLocation,
    bloodType?: string,
    nameClinic?: string,
    cnpj?: string;
    donorId?: string;
    donor?: Donor;
}
