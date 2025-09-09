import { User } from "./user";

export interface Donor {
    id?: string;
    bloodType: string;
    apto: boolean;
    userId: string;
    user?: User;
}