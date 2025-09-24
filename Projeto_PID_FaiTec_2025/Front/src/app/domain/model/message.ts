import { User } from "./user";

export interface Message {
    id?: number;
    senderId: number;
    receiverId: number;
    message: string;
    sentAt?: Date;
    sender?: User;
    receiver?: User;
}