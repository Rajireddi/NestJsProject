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
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments.', type: [Payment] })
  async findAll(): Promise<Payment[]> {
    return await this.paymentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 200, description: 'Return the payment.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string): Promise<Payment> {
    return await this.paymentsService.findOne(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 200, description: 'The payment has been successfully updated.', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return await this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: Number })
  @ApiResponse({ status: 204, description: 'The payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.paymentsService.remove(+id);
  }
}