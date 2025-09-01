import { BloodType } from "./bloodType";
import { DonatorType } from "./donorType";

export interface Donator {
    id?: bigint,
    fullname: string,
    email: string,
    password: string,
    //specifics
    state?: string,
    city?: string,
    bloodType?: BloodType,
    donatorType?: DonatorType
    benefit: boolean,
}