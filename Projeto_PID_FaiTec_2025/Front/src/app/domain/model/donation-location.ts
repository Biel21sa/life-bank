import { Municipality } from "./municipality";

export interface DonationLocation {
    id?: string;
    name: string;
    street: string;
    number: string;
    neighborhood: string;
    postalCode: string;
    municipalityId: string;
    municipality: Municipality;
}