import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createPaymentIntent(amount: number, currency: string, description?: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description,
        // For testing purposes, we'll configure it to work with test cards
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
        return_url: 'http://localhost:3000/return', // For testing purposes
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(`Failed to confirm payment: ${error.message}`);
    }
  }

  async savePaymentToDatabase(paymentIntent: Stripe.PaymentIntent): Promise<Payment> {
    try {
      const payment = new Payment();
      payment.amount = paymentIntent.amount / 100; // Convert from cents
      payment.currency = paymentIntent.currency;
      payment.description = paymentIntent.description || undefined;
      payment.status = paymentIntent.status;

      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new BadRequestException(`Failed to save payment to database: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve payment status: ${error.message}`);
    }
  }
}