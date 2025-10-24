export interface Payment {
  id: number;
  amount: number;
  currency: string;
  description?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}