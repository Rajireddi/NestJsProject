import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'The ID of the payment method to use for this payment',
    example: 'pm_card_visa',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}