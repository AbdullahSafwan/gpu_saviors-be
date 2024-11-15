import { Request, Response } from 'express';
import { systemConfigurationController } from '../../src/controllers/systemConfiguration';
import { systemConfigurationDao } from '../../src/dao/systemConfiguration';
import prisma from '../../src/prisma';

// Mocking the systemConfigurationDao and prisma
jest.mock('../../src/dao/systemConfiguration');
jest.mock('../../src/prisma', () => ({
  systemConfiguration: {
    // Mock necessary Prisma models if needed
  }
}));

describe('systemConfigurationController', () => {
  describe('createSystemConfiguration', () => {
    it('should successfully create a system configuration and return a 200 status', async () => {
      const mockRequest = {
        body: { key: 'some_key', value: 'some_value' }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockConfig = { id: 1, key: 'some_key', value: 'some_value' };

      // Mock the systemConfigurationDao.createSystemConfiguration function
      systemConfigurationDao.createSystemConfiguration = jest.fn().mockResolvedValue(mockConfig);

      await systemConfigurationController.createSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.createSystemConfiguration).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockConfig);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
        body: { key: 'some_key', value: 'some_value' }
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      systemConfigurationDao.createSystemConfiguration = jest.fn().mockRejectedValue(new Error('Database error'));

      await systemConfigurationController.createSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.createSystemConfiguration).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Database error'));
    });
  });

  describe('getSystemConfigurationDetails', () => {
    it('should return system configuration details and a 200 status', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockConfig = { id: 1, key: 'some_key', value: 'some_value' };

      systemConfigurationDao.getSystemConfiguration = jest.fn().mockResolvedValue(mockConfig);

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(systemConfigurationDao.getSystemConfiguration).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockConfig);
    });

    it('should return a 400 status if no ID is provided', async () => {
      const mockRequest = {
        params: {}
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('id is required');
    });

    it('should return a 400 status if system configuration is not found', async () => {
      const mockRequest = {
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      systemConfigurationDao.getSystemConfiguration = jest.fn().mockResolvedValue(null);

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(systemConfigurationDao.getSystemConfiguration).toHaveBeenCalledWith(prisma, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('System configuration not found');
    });
  });

  describe('updateSystemConfiguration', () => {
    it('should update system configuration and return a 200 status', async () => {
      const mockRequest = {
          body: { key: 'updated_key', value: 'updated_value' },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const updatedConfig = { id: 1, key: 'updated_key', value: 'updated_value' };

      systemConfigurationDao.updateSystemConfiguration = jest.fn().mockResolvedValue(updatedConfig);

      await systemConfigurationController.updateSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.updateSystemConfiguration).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedConfig);
    });

    it('should return a 400 status on error', async () => {
      const mockRequest = {
          body: { key: 'updated_key', value: 'updated_value' },
          params: { id: '1' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      systemConfigurationDao.updateSystemConfiguration = jest.fn().mockRejectedValue(new Error('Database error'));

      await systemConfigurationController.updateSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.updateSystemConfiguration).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
});
