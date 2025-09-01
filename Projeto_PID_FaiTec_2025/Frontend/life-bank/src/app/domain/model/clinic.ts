export interface Clinic {
    id?: bigint,
    fullname: string,
    email: string,
    cnpj: string,
    password: string,
    //specifics
    state?: string,
    city?: string,
}