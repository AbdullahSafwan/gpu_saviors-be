import { Request, Response } from "express";
import { refundController } from "../../src/controllers/refund";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { refundService } from "../../src/services/refund";

jest.mock("../../src/services/refund");

jest.mock("../../src/prisma", () => ({
  refund: {
    // Mock any necessary Prisma models if needed
  },
}));

describe("refundController", () => {
  describe("createRefund", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should successfully create a refund and return a 200 status", async () => {
      const mockRefundData = { id: 1, amount: 100, orderId: 1 };

      const mockRequest = {
        body: mockRefundData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the refundService.createRefund function
      refundService.createRefund = jest.fn().mockResolvedValue(mockRefundData);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await refundController.createRefund(mockRequest, mockResponse);

      expect(refundService.createRefund).toHaveBeenCalledWith(mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockRefundData);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockRequest = {
        body: { amount: 100, orderId: 1 },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund creation failed");
      refundService.createRefund = jest.fn().mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await refundController.createRefund(mockRequest, mockResponse);

      expect(refundService.createRefund).toHaveBeenCalledWith(mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore the original implementation
      sendErrorSpy.mockRestore();
    });
  });

  describe("getRefundDetails", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should return refund details and a 200 status", async () => {
      const mockRequest = {
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockRefund = { id: 1, amount: 100, orderId: 1 };

      refundService.getRefund = jest.fn().mockResolvedValue(mockRefund);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await refundController.getRefundDetails(mockRequest, mockResponse);

      expect(refundService.getRefund).toHaveBeenCalledWith(1);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockRefund);
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

      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await refundController.getRefundDetails(mockRequest, mockResponse);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, "Error fetching refund", new Error("id is required"));
    });

    it("should return a 400 status if refund is not found", async () => {
      const mockRequest = {
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund fetch failed");
      (refundService.getRefund as jest.Mock).mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse");

      await refundController.getRefundDetails(mockRequest, mockResponse);

      expect(refundService.getRefund).toHaveBeenCalledWith(1);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      sendErrorSpy.mockRestore();
    });
  });

  describe("updateRefund", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should update refund and return a 200 status", async () => {
      const mockRequest = {
        body: { amount: 150 },
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const updatedRefund = { id: 1, amount: 150, orderId: 1 };

      // Mock the refundService.updateRefund function
      refundService.updateRefund = jest.fn().mockResolvedValue(updatedRefund);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await refundController.updateRefund(mockRequest, mockResponse);

      expect(refundService.updateRefund).toHaveBeenCalledWith(1, mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updatedRefund);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return a 400 status on error", async () => {
      const mockRequest = {
        body: { amount: 150 },
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund update failed");

      // Mock the DAO function to reject
      refundService.updateRefund = jest.fn().mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await refundController.updateRefund(mockRequest, mockResponse);

      expect(refundService.updateRefund).toHaveBeenCalledWith(1, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
