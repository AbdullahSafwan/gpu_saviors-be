import { Request, Response } from "express";
import { deliveryController } from "../../src/controllers/delivery"; // adjust the path
import { deliveryDao } from "../../src/dao/delivery"; // adjust the path
import prisma from "../../src/prisma"; // adjust the path to your Prisma instance
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { delivery_status } from "@prisma/client";

// Type the methods of deliveryDao as Jest mocks
jest.mock("../../src/dao/delivery");

describe("Delivery Controller", () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for createDelivery
  describe("createDelivery", () => {
    it("should create a delivery successfully", async () => {
      const mockData = { status: "Pending", bookingId: 123 };
      const mockResult = { id: 1, ...mockData };

      const mockRequest = {
        body: mockData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      deliveryDao.createDelivery = jest.fn().mockResolvedValue(mockData);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await deliveryController.createDelivery(mockRequest, mockResponse);

      expect(deliveryDao.createDelivery).toHaveBeenCalledWith(prisma, mockData);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockData);
    });

    it("should return error when createDelivery fails", async () => {
      const mockData = { status: "Pending", bookingId: 123 };
      const mockRequest = {
        body: mockData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Failed to create delivery");

      deliveryDao.createDelivery = jest.fn().mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await deliveryController.createDelivery(mockRequest, mockResponse);

      expect(deliveryDao.createDelivery).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
    });
  });

  // Test for getDeliveryDetails
  describe("getDeliveryDetails", () => {
    it("should return delivery details successfully", async () => {
      const mockId = 1;
      const mockDelivery = { id: mockId, status: "Delivered" };
      const mockRequest = {
        params: { id: "1" },
      }  as Request<{ id: string }, {}, {}>;;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      deliveryDao.getDelivery = jest.fn().mockResolvedValue(mockDelivery);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await deliveryController.getDeliveryDetails(mockRequest, mockResponse);

      expect(deliveryDao.getDelivery).toHaveBeenCalledWith(prisma, mockId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockDelivery);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should return error when id is not provided", async () => {
      const mockRequest = {
        params: {},
      }  as Request<{ id: string }, {}, {}>;;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await deliveryController.getDeliveryDetails(mockRequest, mockResponse);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, "Error fetching delivery", expect.any(Error));

      sendErrorSpy.mockRestore();
    });

    it("should return error when delivery is not found", async () => {
      const mockId = 1;
      const mockRequest = {
        params: { id: mockId.toString() },
      }  as Request<{ id: string }, {}, {}>;;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Delivery not found");
      deliveryDao.getDelivery = jest.fn().mockRejectedValue(mockError);
      // mockGetDelivery.mockResolvedValue(null); // Simulate no data found
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse");

      await deliveryController.getDeliveryDetails(mockRequest, mockResponse);

      expect(deliveryDao.getDelivery).toHaveBeenCalledWith(prisma, mockId);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
    });
  });

  // Test for updateDelivery
  describe("updateDelivery", () => {
    it("should update a delivery successfully", async () => {
      const mockId = 1;
      const mockData = { status: delivery_status.DELIVERED };
      const mockResult = { id: mockId, ...mockData };

      const mockRequest = {
        body: mockData,
        params: { id: mockId.toString() },
      } as Request<{ id: string }, {}, typeof mockData>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      deliveryDao.updateDelivery = jest.fn().mockResolvedValue(mockResult);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await deliveryController.updateDelivery(mockRequest, mockResponse);

      expect(deliveryDao.updateDelivery).toHaveBeenCalledWith(prisma, mockId, mockData);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockResult);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return error when updateDelivery fails", async () => {
      const mockId = 1;
      const mockData = { status: delivery_status.IN_TRANSIT_OUTBOUND };

      const mockRequest = {
        body: mockData,
        params: { id: mockId.toString() },
      } as Request<{ id: string }, {}, typeof mockData>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund update failed");

      deliveryDao.updateDelivery = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await deliveryController.updateDelivery(mockRequest, mockResponse);

      expect(deliveryDao.updateDelivery).toHaveBeenCalledWith(prisma, mockId, mockData);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
