export class CreatePaymentDto {
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
  readonly status?: string;
}