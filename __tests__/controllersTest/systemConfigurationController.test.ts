import { Request, Response } from "express";
import { systemConfigurationController } from "../../src/controllers/systemConfiguration";
import { systemConfigurationDao } from "../../src/dao/systemConfiguration";
import prisma from "../../src/prisma";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed

// Mocking the systemConfigurationDao and prisma
jest.mock("../../src/dao/systemConfiguration");
jest.mock("../../src/prisma", () => ({
  systemConfiguration: {
    // Mock necessary Prisma models if needed
  },
}));

describe("systemConfigurationController", () => {
  describe("createSystemConfiguration", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should successfully create a system configuration and return a 200 status", async () => {
      const mockRefundData = { key: "some_key", value: "some_value" };
      const mockRequest = {
        body: mockRefundData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockConfig = { key: "some_key", value: "some_value" };

      // Mock the systemConfigurationDao.createSystemConfiguration function
      systemConfigurationDao.createSystemConfiguration = jest.fn().mockResolvedValue(mockConfig);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await systemConfigurationController.createSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.createSystemConfiguration).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockRefundData);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockRefundData = { key: "some_key", value: "some_value" };

      const mockRequest = {
        body: mockRefundData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error creating system configuration");

      systemConfigurationDao.createSystemConfiguration = jest.fn().mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await systemConfigurationController.createSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.createSystemConfiguration).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore the original implementation
      sendErrorSpy.mockRestore();
    });
  });

  describe("getSystemConfigurationDetails", () => {
    it("should return system configuration details and a 200 status", async () => {
      const mockId = 1;

      const mockRequest = {
        params: { id: mockId.toString() },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockConfig = { id: 1, key: "some_key", value: "some_value" };

      systemConfigurationDao.getSystemConfiguration = jest.fn().mockResolvedValue(mockConfig);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(systemConfigurationDao.getSystemConfiguration).toHaveBeenCalledWith(prisma, mockId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockConfig);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status if no ID is provided", async () => {
      const mockRequest = {
        params: {},
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith("id is required");
    });

    it("should return a 400 status if system configuration is not found", async () => {
      const mockId = 1;
      const mockRequest = {
        params: { id: mockId.toString() },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error(`system configuration not found against id: ${mockId}`);

      systemConfigurationDao.getSystemConfiguration = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse");

      await systemConfigurationController.getSystemConfigurationDetails(mockRequest, mockResponse);

      expect(systemConfigurationDao.getSystemConfiguration).toHaveBeenCalledWith(prisma, mockId);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      sendErrorSpy.mockRestore();
    });
  });

  describe("updateSystemConfiguration", () => {
    it("should update system configuration and return a 200 status", async () => {
      const mockData = { key: "updated_key", value: "updated_value" };
      const mockRequest = {
        body: mockData,
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const updatedConfig = { id: 1, key: "updated_key", value: "updated_value" };

      systemConfigurationDao.updateSystemConfiguration = jest.fn().mockResolvedValue(updatedConfig);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await systemConfigurationController.updateSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.updateSystemConfiguration).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updatedConfig);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockData = { key: "updated_key", value: "updated_value" };
      const mockRequest = {
        body: mockData,
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error updating system configuration");

      systemConfigurationDao.updateSystemConfiguration = jest.fn().mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await systemConfigurationController.updateSystemConfiguration(mockRequest, mockResponse);

      expect(systemConfigurationDao.updateSystemConfiguration).toHaveBeenCalledWith(prisma, 1, mockData);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
