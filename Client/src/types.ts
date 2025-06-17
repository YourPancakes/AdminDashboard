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

export interface PaymentDto {
  id: number;
  clientId: number;
  amountT: number;
  timestamp: string;
  client: ClientDto;
}