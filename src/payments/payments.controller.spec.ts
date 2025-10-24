import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPayment = {
    id: 1,
    amount: 100,
    currency: 'USD',
    description: 'Test payment',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaymentService = {
    create: jest.fn().mockResolvedValue(mockPayment),
    findAll: jest.fn().mockResolvedValue([mockPayment]),
    findOne: jest.fn().mockResolvedValue(mockPayment),
    update: jest.fn().mockResolvedValue(mockPayment),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const createPaymentDto = {
        amount: 100,
        currency: 'USD',
        description: 'Test payment',
      };

      const result = await controller.create(createPaymentDto);
      expect(result).toEqual(mockPayment);
      expect(service.create).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockPayment]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPayment);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const updatePaymentDto = {
        status: 'completed',
      };

      const result = await controller.update('1', updatePaymentDto);
      expect(result).toEqual(mockPayment);
      expect(service.update).toHaveBeenCalledWith(1, updatePaymentDto);
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});