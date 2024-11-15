import { Request, Response } from 'express';
import { serviceController } from '../../src/controllers/service';
import { serviceDao } from '../../src/dao/service';
import prisma from '../../src/prisma';

// Mocking the serviceDao and prisma
jest.mock('../../src/dao/service');
jest.mock('../../src/prisma', () => ({
  service: {
    // Mock necessary Prisma models if needed
  }
}));

describe('serviceController', () => {
  describe('createService', () => {
    it('should successfully create a service and return a 200 status', async () => {
      const mockRequest = {
        body: { name: 'Test Service', description: 'Test Description' }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockServiceData = { id: 1, name: 'Test Service', description: 'Test Description' };

      // Mock the serviceDao.createService function
      serviceDao.createService = jest.fn().mockResolvedValue(mockServiceData);

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceDao.createService).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockServiceData);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
        body: { name: 'Test Service', description: 'Test Description' }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      serviceDao.createService = jest.fn().mockRejectedValue(new Error('Database error'));

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceDao.createService).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Database error'));
    });
  });

  describe('getServiceDetails', () => {
    it('should return service details and a 200 status', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockService = { id: 1, name: 'Test Service', description: 'Test Description' };

      serviceDao.getService = jest.fn().mockResolvedValue(mockService);

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceDao.getService).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockService);
    });

    it('should return a 400 status if no ID is provided', async () => {
      const mockRequest = {
        params: {}
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('id is required');
    });

    it('should return a 400 status if service is not found', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      serviceDao.getService = jest.fn().mockResolvedValue(null);

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceDao.getService).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Service not found');
    });
  });

  describe('updateService', () => {
    it('should update service and return a 200 status', async () => {
      const mockRequest = {
          body: { name: 'Updated Service', description: 'Updated Description' },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const updatedService = { id: 1, name: 'Updated Service', description: 'Updated Description' };

      serviceDao.updateService = jest.fn().mockResolvedValue(updatedService);

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceDao.updateService).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedService);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
          body: { name: 'Updated Service', description: 'Updated Description' },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      serviceDao.updateService = jest.fn().mockRejectedValue(new Error('Database error'));

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceDao.updateService).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
});
