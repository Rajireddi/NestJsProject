import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  private payments: Payment[] = [];
  private idCounter = 1;

  create(createPaymentDto: CreatePaymentDto): Payment {
    const newPayment = new Payment();
    newPayment.id = this.idCounter++;
    newPayment.amount = createPaymentDto.amount;
    newPayment.currency = createPaymentDto.currency;
    newPayment.description = createPaymentDto.description;
    newPayment.status = createPaymentDto.status || 'pending';
    newPayment.createdAt = new Date();
    newPayment.updatedAt = new Date();
    
    this.payments.push(newPayment);
    return newPayment;
  }

  findAll(): Payment[] {
    return this.payments;
  }

  findOne(id: number): Payment {
    const payment = this.payments.find(payment => payment.id === id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto): Payment {
    const paymentIndex = this.payments.findIndex(payment => payment.id === id);
    if (paymentIndex === -1) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    const updatedPayment = new Payment();
    Object.assign(updatedPayment, this.payments[paymentIndex], updatePaymentDto, { 
      updatedAt: new Date() 
    });
    
    this.payments[paymentIndex] = updatedPayment;
    return updatedPayment;
  }

  remove(id: number): void {
    const paymentIndex = this.payments.findIndex(payment => payment.id === id);
    if (paymentIndex === -1) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    this.payments.splice(paymentIndex, 1);
  }
}