import { bookingController } from "../../src/controllers/booking";
import { Request, Response } from "express";
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { booking_item_type } from "@prisma/client";
import { bookingService } from "../../src/services/booking";

// Mock the dependencies
jest.mock("../../src/services/booking");

jest.mock("../../src/prisma", () => ({
  // Add any mock prisma methods that may be used
}));

describe("bookingController", () => {
  let sendMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Create mock functions for response
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a new booking and return a result", async () => {
      const mockBookingData = {
        clientName: "John Doe",
        phoneNumber: "1234567890",
        whatsappNumber: "0987654321",
        booking_items: {
          create: [
            { name: "Item 1", type: booking_item_type.GPU, payableAmount: 100 },
            { name: "Item 2", type: booking_item_type.MOBO, payableAmount: 200 },
          ],
        },
        code: "M3QA3ZSV",
        payableAmount: 300,
      };

      const mockRequest = {
        body: mockBookingData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the behavior of the `createBooking` method in bookingService
      bookingService.createBooking = jest.fn().mockResolvedValue(mockBookingData);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.createBooking(mockRequest, mockResponse);

      expect(bookingService.createBooking).toHaveBeenCalledWith(mockBookingData);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockBookingData);

      // Restore the spy
      sendSuccessSpy.mockRestore();
    });

    it("should return an error if the data is invalid", async () => {
      const invalidBookingData = {
        clientName: "x1",
        phoneNumber: " 2",
        whatsappNumber: "123",
        booking_items: [],
        code: "",
        payableAmount: 0,
      };

      const mockRequest = {
        body: invalidBookingData,
      } as Request<{}, {}, typeof invalidBookingData>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Refund creation failed");

      // Mock the `createBooking` to throw an error
      (bookingService.createBooking as jest.Mock).mockRejectedValue(mockError);

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await bookingController.createBooking(mockRequest, mockResponse);

      expect(bookingService.createBooking).toHaveBeenCalledWith(mockRequest.body);
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
      } as Request<{ id: string }, {}, {}>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      bookingService.getBooking = jest.fn().mockResolvedValue(mockBooking);
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.getBookingDetails(mockRequest, mockResponse);

      expect(bookingService.getBooking).toHaveBeenCalledWith(1);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockBooking);
      sendSuccessSpy.mockRestore();
    });

    it("should return an error if the ID is missing", async () => {
      const mockRequest = {
        params: {}, // No 'id' provided
      } as Request<{ id: string }, {}, {}>;

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

  describe("listBookings", () => {
    it("should return a successful response with bookings", async () => {
      const mockBookings = [
        { id: 1, bookingName: "Booking 1" },
        { id: 2, bookingName: "Booking 2" },
      ];
      const mockPaginationResult = {
        data: mockBookings,
        total: 2,
        page: 1,
        pageSize: 11,
      };

      // Mock the booking service to return the expected result
      bookingService.listBookings = jest.fn().mockResolvedValue(mockPaginationResult);

      // Mock the success response handler
      const sendSuccessSpy = jest
        .spyOn(responseHelper, "sendSuccessResponse")
        .mockImplementation((res: Response, statusCode: number, message: string | string[], data: any) => {
          res.status(statusCode).json({ message, data });
        });

      // Setting query parameters in the request
      const req = {
        query: {
          page: "1",
          pageSize: "11",
          sortBy: "id",
          orderBy: "desc",
          status: "DRAFT",
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await bookingController.listBookings(req, res);

      expect(bookingService.listBookings).toHaveBeenCalledWith(1, 11, "id", "desc", "DRAFT");
      expect(sendSuccessSpy).toHaveBeenCalledWith(res, 200, "Successfully fetched bookings list", mockPaginationResult);

      sendSuccessSpy.mockRestore(); // Restore the spy after test
    });

    it("should handle errors and return an error response", async () => {
      const mockError = new Error("Something went wrong");

      // Mock the booking service to throw an error
      bookingService.listBookings = jest.fn().mockRejectedValue(mockError);

      // Mock the error response handler
      const sendErrorSpy = jest
        .spyOn(responseHelper, "sendErrorResponse")
        .mockImplementation((res: Response, statusCode: number, message: string | string[], error: any) => {
          res.status(statusCode).json({ message, error });
        });

      // Setting query parameters in the request
      const req = {
        query: {
          page: "1",
          pageSize: "11",
          sortBy: "id",
          orderBy: "desc",
          status: "DRAFT",
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await bookingController.listBookings(req, res);

      expect(bookingService.listBookings).toHaveBeenCalledWith(1, 11, "id", "desc", "DRAFT");
      expect(sendErrorSpy).toHaveBeenCalledWith(res, 400, "Error fetching bookings list", mockError);

      sendErrorSpy.mockRestore(); // Restore the spy after test
    });
  });

  describe("updateBooking", () => {
    it("should update the booking and return the updated result", async () => {
      const mockBookingUpdate = {
        clientName: "ABC123",
        payableAmount: 350,
      };

      const mockRequest = {
        params: { id: "1" },
        body: mockBookingUpdate,
      } as Request<{ id: string }, {}, typeof mockBookingUpdate>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const updateBooking = { id: 1, ...mockBookingUpdate };

      bookingService.updateBooking = jest.fn().mockResolvedValue(updateBooking);

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await bookingController.updateBooking(mockRequest, mockResponse);

      expect(bookingService.updateBooking).toHaveBeenCalledWith(1, mockBookingUpdate);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), updateBooking);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should return an error if the update fails", async () => {
      const mockBookingUpdate = {
        clientName: "ABC123",
        payableAmount: 350,
      };

      const mockRequest = {
        body: mockBookingUpdate,
        params: { id: "1" },
      } as Request<{ id: string }, {}, typeof mockBookingUpdate>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error updating booking");

      bookingService.updateBooking = jest.fn().mockRejectedValue(mockError);
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await bookingController.updateBooking(mockRequest, mockResponse);

      expect(bookingService.updateBooking).toHaveBeenCalledWith(1, mockRequest.body);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
