export interface ClientDto {
  id: number;
  name: string;
  email: string;
  balanceT: number;
}

export interface RateDto {
  id: number;
  currentRate: number;
  updatedAt: string;
}
