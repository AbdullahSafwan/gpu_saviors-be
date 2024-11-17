import { bookingController } from "../../src/controllers/booking";
import { Request, Response } from "express";
import { bookingDao } from "../../src/dao/booking";
import prisma from "../../src/prisma";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed

// Mock the dependencies
jest.mock("../../src/dao/booking", () => ({
  bookingDao: {
    createBooking: jest.fn(),
    getBooking: jest.fn(),
    updateBooking: jest.fn(),
  },
}));

jest.mock("../../src/prisma", () => ({
  // Add any mock prisma methods that may be used
}));

describe("bookingController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let sendMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Create mock functions for response
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });

    res = {
      status: statusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a new booking and return a result", async () => {
      const mockBookingData = {
        booking_items: [{ payableAmount: 100 }, { payableAmount: 200 }],
        code: "ABC123",
        payableAmount: 300,
      };

      const mockRequest = {
        body: mockBookingData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the behavior of the `createBooking` method in bookingDao
      bookingDao.createBooking = jest.fn().mockResolvedValue(mockBookingData);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.createBooking(mockRequest, mockResponse);

      expect(bookingDao.createBooking).toHaveBeenCalledWith(prisma, mockBookingData);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockBookingData);
    });

    it("should return an error if the data is invalid", async () => {
      const invalidBookingData = {
        booking_items: [],
        code: "",
        payableAmount: 0,
      };

      const mockRequest = {
        body: invalidBookingData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund creation failed");

      // Mock the `createBooking` to throw an error
      (bookingDao.createBooking as jest.Mock).mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await bookingController.createBooking(mockRequest, mockResponse);

      expect(bookingDao.createBooking).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      sendErrorSpy.mockRestore();
    });
  });

  describe("getBookingDetails", () => {
    it("should get booking details for a valid ID", async () => {
      const mockBooking = {
        id: 1,
        code: "ABC123",
        payableAmount: 300,
        booking_items: [],
      };

      const mockRequest = {
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      bookingDao.getBooking = jest.fn().mockResolvedValue(mockBooking);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.getBookingDetails(mockRequest, mockResponse);

      expect(bookingDao.getBooking).toHaveBeenCalledWith(prisma, 1);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockBooking);
      sendSuccessSpy.mockRestore();
    });

    it("should return an error if the ID is missing", async () => {
      const mockRequest = {
        params: {}, // No 'id' provided
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(), // Allow chaining
        json: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await bookingController.getBookingDetails(mockRequest, mockResponse);

      // Verify sendErrorResponse was invoked with the correct arguments
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), new Error("id is required"));

      sendErrorSpy.mockRestore(); // Restore the original function
    });
  });

  describe("updateBooking", () => {
    it("should update the booking and return the updated result", async () => {
      const mockBookingUpdate = {
        code: "ABC123",
        payableAmount: 350,
      };

      const mockRequest = {
        params: { id: "1" },
        body: mockBookingUpdate,
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const updateBooking = { id: 1, ...mockBookingUpdate };

      bookingDao.updateBooking = jest.fn().mockResolvedValue(updateBooking);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.updateBooking(mockRequest, mockResponse);

      expect(bookingDao.updateBooking).toHaveBeenCalledWith(prisma, 1, mockBookingUpdate);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updateBooking);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return an error if the update fails", async () => {
      const mockBookingUpdate = {
        code: "ABC123",
        payableAmount: 350,
      };

      const mockRequest = {
        body: mockBookingUpdate,
        params: { id: "1" },
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error updating booking");

      bookingDao.updateBooking = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await bookingController.updateBooking(mockRequest, mockResponse);

      expect(bookingDao.updateBooking).toHaveBeenCalledWith(prisma, 1, mockRequest.body);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
