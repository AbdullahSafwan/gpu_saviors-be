import { Request, Response } from "express";
import { serviceController } from "../../src/controllers/service";
import { serviceDao } from "../../src/dao/service";
import prisma from "../../src/prisma";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { mock } from "node:test";

// Mocking the serviceDao and prisma
jest.mock("../../src/dao/service");
jest.mock("../../src/prisma", () => ({
  service: {
    // Mock necessary Prisma models if needed
  },
}));

describe("serviceController", () => {
  describe("createService", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should successfully create a service and return a 200 status", async () => {
      const mockRequest = {
        body: { name: "Test Service", description: "Test Description" },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockServiceData = { id: 1, name: "Test Service", description: "Test Description" };

      // Mock the serviceDao.createService function
      serviceDao.createService = jest.fn().mockResolvedValue(mockServiceData);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceDao.createService).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockServiceData);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockRequest = {
        body: { name: "Test Service", description: "Test Description" },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error creating service");
      serviceDao.createService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceDao.createService).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore the original implementation
      sendErrorSpy.mockRestore();
    });
  });

  describe("getServiceDetails", () => {
    it("should return service details and a 200 status", async () => {
      const mockRequest = {
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockService = { id: 1, name: "Test Service", description: "Test Description" };

      serviceDao.getService = jest.fn().mockResolvedValue(mockService);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceDao.getService).toHaveBeenCalledWith(prisma, 1);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockService);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status if no ID is provided", async () => {
      const mockRequest = {
        params: {},
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith("id is required");
    });

    it("should return a 400 status if service is not found", async () => {
      const mockId = 1;
      const mockRequest = {
        params: { id: mockId.toString() },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error(`service not found against id: ${mockId}`);

      serviceDao.getService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceDao.getService).toHaveBeenCalledWith(prisma, mockId);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
    });
  });

  describe("updateService", () => {
    it("should update service and return a 200 status", async () => {
      const mockUpdatedData = { name: "Updated Service", description: "Updated Description" };

      const mockRequest = {
        body: mockUpdatedData,
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const updatedService = { id: 1, ...mockUpdatedData };

      serviceDao.updateService = jest.fn().mockResolvedValue(updatedService);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceDao.updateService).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updatedService);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockUpdatedData = { name: "Updated Service", description: "Updated Description" };
      const mockRequest = {
        body: mockUpdatedData,
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error(expect.any(String));

      serviceDao.updateService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceDao.updateService).toHaveBeenCalledWith(prisma, 1, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
