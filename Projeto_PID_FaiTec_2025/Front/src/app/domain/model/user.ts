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
    postal_code: string,
    donation_location_id?: string,
    blood_type?: string,
    nameClinic?: string,
    cnpj?: string
}
