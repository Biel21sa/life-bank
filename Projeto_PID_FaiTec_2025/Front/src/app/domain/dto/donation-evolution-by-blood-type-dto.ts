import { DonationByBloodTypeData } from "./donation-by-blood-type-dto";

export interface DonationEvolutionByTypeData {
    month: string;
    data: DonationByBloodTypeData[];
}