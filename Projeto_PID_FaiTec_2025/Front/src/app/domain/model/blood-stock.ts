import { DonationLocation } from "./donation-location";

export interface BloodStock {
    id?: number;
    bloodType: string;
    minimumStock: number;
    maximumStock: number;
    currentStock: number;
    donationLocationId: string;
    donationLocation?: DonationLocation;
}