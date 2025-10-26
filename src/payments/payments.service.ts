import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private stripeService: StripeService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Create a payment intent with Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentDto.amount,
      createPaymentDto.currency,
      createPaymentDto.description,
    );

    // Save payment to database
    const payment = new Payment();
    payment.amount = createPaymentDto.amount;
    payment.currency = createPaymentDto.currency;
    payment.description = createPaymentDto.description;
    payment.status = 'created';

    return await this.paymentsRepository.save(payment);
  }

  async processPayment(id: number, paymentMethodId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    try {
      // Create a new payment intent with Stripe
      const paymentIntent = await this.stripeService.createPaymentIntent(
        payment.amount,
        payment.currency,
        payment.description,
      );

      // Confirm the payment with Stripe
      const confirmedPaymentIntent = await this.stripeService.confirmPayment(
        paymentIntent.id,
        paymentMethodId,
      );

      // Update payment status in database
      payment.status = confirmedPaymentIntent.status;
      return await this.paymentsRepository.save(payment);
    } catch (error) {
      payment.status = 'failed';
      await this.paymentsRepository.save(payment);
      throw new BadRequestException(`Payment failed: ${error.message}`);
    }
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) {
      throw new BadRequestException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return await this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }
}