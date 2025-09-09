import { Blood } from "./blood";
import { DonationLocation } from "./donation-location";
import { Donor } from "./donor";

export interface Donation {
    id?: string;
    bloodType: string;
    quantity: number;
    collectionDate: Date;
    expirationDate: Date;
    donorId: string;
    donationLocationId: string;
    bloodId?: number;
    donor?: Donor;
    blood?: Blood;
    donationLocation?: DonationLocation;
    donorName?: string;
    donorCpf?: string;
}