import { Request, Response } from "express";
import { serviceController } from "../../src/controllers/service";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { serviceService } from "../../src/services/service";

// Mocking the serviceService and prisma
jest.mock("../../src/services/service");
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

      // Mock the serviceService.createService function
      serviceService.createService = jest.fn().mockResolvedValue(mockServiceData);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceService.createService).toHaveBeenCalledWith(mockRequest.body);
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
      serviceService.createService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.createService(mockRequest, mockResponse);

      expect(serviceService.createService).toHaveBeenCalledWith(mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore the original implementation
      sendErrorSpy.mockRestore();
    });
  });

  describe("getServiceDetails", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should return service details and a 200 status", async () => {
      const mockRequest = {
        params: { id: "1" },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockService = { id: 1, name: "Test Service", description: "Test Description" };

      serviceService.getService = jest.fn().mockResolvedValue(mockService);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceService.getService).toHaveBeenCalledWith(1);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockService);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status if no ID is provided", async () => {
      const mockRequest = {
        params: {},
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      // Verify sendErrorResponse was invoked with the correct arguments
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, "Error fetching service", new Error("id is required"));

      sendErrorSpy.mockRestore(); // Restore the original function
    });

    it("should return a 400 status if service is not found", async () => {
      const mockId = 1;
      const mockRequest = {
        params: { id: mockId.toString() },
      } as Request<{ id: string }>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error(`service not found against id: ${mockId}`);

      serviceService.getService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.getServiceDetails(mockRequest, mockResponse);

      expect(serviceService.getService).toHaveBeenCalledWith(mockId);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
    });
  });

  describe("updateService", () => {
    it("should update service and return a 200 status", async () => {
      const mockUpdatedData = { name: "Updated Service", description: "Updated Description" };

      const mockRequest = {
        body: mockUpdatedData,
        params: { id: "1" },
      } as Request<{ id: string }, {}, any>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const updatedService = { id: 1, ...mockUpdatedData };

      serviceService.updateService = jest.fn().mockResolvedValue(updatedService);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceService.updateService).toHaveBeenCalledWith(1, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updatedService);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockUpdatedData = { name: "Updated Service", description: "Updated Description" };
      const mockRequest = {
        body: mockUpdatedData,
        params: { id: "1" },
      } as Request<{ id: string }, {}, any>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error(expect.any(String));

      serviceService.updateService = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await serviceController.updateService(mockRequest, mockResponse);

      expect(serviceService.updateService).toHaveBeenCalledWith(1, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
