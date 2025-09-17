import { User } from "./user";

export interface Donor {
    id?: string;
    bloodType: string;
    apto: boolean;
    userId: string;
    gender: string;
    user?: User;
}