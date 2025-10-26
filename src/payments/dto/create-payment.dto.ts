import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  readonly amount: number;

  @IsString()
  readonly currency: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly status?: string;
}