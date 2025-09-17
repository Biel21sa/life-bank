export interface Benefit {
  id?: string;
  amount: number;
  expirationDate: Date;
  description: string;
  used: boolean;
  donationId: string;
  donorId: string;
}