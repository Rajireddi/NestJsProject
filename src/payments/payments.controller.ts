import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'The payment has been successfully created.', type: Payment })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createPaymentDto: CreatePaymentDto): Payment {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments.', type: [Payment] })
  findAll(): Payment[] {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 200, description: 'Return the payment.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: string): Payment {
    return this.paymentsService.findOne(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 200, description: 'The payment has been successfully updated.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto): Payment {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 204, description: 'The payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  remove(@Param('id') id: string): void {
    return this.paymentsService.remove(+id);
  }
}