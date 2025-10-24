import { ApiProperty } from '@nestjs/swagger';

export class Payment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}