import { Request, Response } from 'express';
import { refundController } from '../../src/controllers/refund';
import { refundDao } from '../../src/dao/refund';
import prisma from '../../src/prisma';

jest.mock('../../src/dao/refund');
jest.mock('../../src/prisma', () => ({
  refund: {
    // Mock any necessary Prisma models if needed
  }
}));

describe('refundController', () => {
  describe('createRefund', () => {
    it('should successfully create a refund and return a 200 status', async () => {
      const mockRequest = {
        body: { amount: 100, orderId: 1 }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockRefundData = { id: 1, amount: 100, orderId: 1 };

      // Mock the refundDao.createRefund function
      refundDao.createRefund = jest.fn().mockResolvedValue(mockRefundData);

      await refundController.createRefund(mockRequest, mockResponse);

      expect(refundDao.createRefund).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockRefundData);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
        body: { amount: 100, orderId: 1 }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      refundDao.createRefund = jest.fn().mockRejectedValue(new Error('Refund not found'));

      await refundController.createRefund(mockRequest, mockResponse);

      expect(refundDao.createRefund).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Refund not found'));
    });
  });

  describe('getRefundDetails', () => {
    it('should return refund details and a 200 status', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockRefund = { id: 1, amount: 100, orderId: 1 };

      refundDao.getRefund = jest.fn().mockResolvedValue(mockRefund);

      await refundController.getRefundDetails(mockRequest, mockResponse);

      expect(refundDao.getRefund).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockRefund);
    });

    it('should return a 400 status if no ID is provided', async () => {
      const mockRequest = {
        params: {}
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await refundController.getRefundDetails(mockRequest, mockResponse);


      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('id is required');
    });

    it('should return a 400 status if refund is not found', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      refundDao.getRefund = jest.fn().mockResolvedValue(null);
      

      await refundController.getRefundDetails(mockRequest, mockResponse);

      expect(refundDao.getRefund).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Refund not found');
    });
  });

  describe('updateRefund', () => {
    it('should update refund and return a 200 status', async () => {
      const mockRequest = {
          body: { amount: 150 },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const updatedRefund = { id: 1, amount: 150, orderId: 1 };

      refundDao.updateRefund = jest.fn().mockResolvedValue(updatedRefund);

      await refundController.updateRefund(mockRequest, mockResponse);

      expect(refundDao.updateRefund).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedRefund);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
          body: { amount: 150 },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      refundDao.updateRefund = jest.fn().mockRejectedValue(new Error('Refund not found'));

      await refundController.updateRefund(mockRequest, mockResponse);

      expect(refundDao.updateRefund).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Refund not found'));
    });
  });
});

