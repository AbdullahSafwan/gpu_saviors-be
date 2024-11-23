import { Request, Response } from "express";
import { userController } from "../../src/controllers/user"; // Adjust the path based on your project
import * as responseHelper from "./../../src/services/responseHelper"; // Adjust the import path as needed
import { userService } from "../../src/services/user";

// Mocking userService and prisma
jest.mock("../../src/services/user");

jest.mock("../../src/prisma", () => ({
  prisma: jest.fn(),
}));

describe("userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user and send a success response", async () => {
      const mockUserData = { id: 1, name: "John", email: "john@example.com" };
      const mockRequest = {
        body: mockUserData,
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      userService.createUser = jest.fn().mockResolvedValue(mockUserData); // Mock successful response

      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();
      await userController.createUser(mockRequest, mockResponse);

      expect(userService.createUser).toHaveBeenCalledWith(mockRequest.body);
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockUserData);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should handle errors and send a failure response", async () => {
      const mockRequest = {
        body: { amount: 100, orderId: 1 },
      } as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error creating user");

      userService.createUser = jest.fn().mockRejectedValue(mockError); // Mock error response

      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await userController.createUser(mockRequest, mockResponse);
      expect(userService.createUser).toHaveBeenCalledWith(mockRequest.body);
      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore the original implementation
      sendErrorSpy.mockRestore();
    });
  });

  describe("getUserDetails", () => {
    it("should retrieve user details and send a success response", async () => {
      const mockRequest = {
        params: { id: "1" },
      } as Request<{ id: string }, {}, {}>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockUserData = { id: 1, name: "John", email: "john@example.com" };

      userService.getUser = jest.fn().mockResolvedValue(mockUserData); // Mock successful response
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await userController.getUserDetails(mockRequest, mockResponse);

      expect(userService.getUser).toHaveBeenCalledWith(1); // Testing the id parsing
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockUserData);
      // Restore the original implementation
      sendSuccessSpy.mockRestore();
    });

    it("should handle errors and send a failure response if id is missing", async () => {
      const mockRequest = {
        params: {},
      } as Request<{ id: string }, {}, {}>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();
      await userController.getUserDetails(mockRequest, mockResponse);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, "Error fetching user", new Error("id is required"));
    });
  });

  describe("updateUser", () => {
    it("should update a user and send a success response", async () => {
      const mockUpdatedUser = { id: 1, name: "John Updated", email: "johnupdated@example.com" };
      const mockRequest = {
        body: { name: "John Updated" },
        params: { id: "1" },
      } as Request<{ id: string }, {}, typeof mockUpdatedUser>;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      userService.updateUser = jest.fn().mockResolvedValue(mockUpdatedUser); // Mock successful response
      // Spy on sendSuccessResponse
      const sendSuccessSpy = jest.spyOn(responseHelper, "sendSuccessResponse").mockImplementation();

      await userController.updateUser(mockRequest, mockResponse);

      expect(userService.updateUser).toHaveBeenCalledWith(1, mockRequest.body); // Testing the id parsing
      expect(sendSuccessSpy).toHaveBeenCalledWith(mockResponse, 200, expect.any(String), mockUpdatedUser);
      // Restore spy (optional for consistency across tests)
      sendSuccessSpy.mockRestore();
    });

    it("should handle errors and send a failure response", async () => {
      const mockUserUpdate = {
        firstName: "xyz"
      }
      const mockRequest = {
        body: mockUserUpdate,
        params: { id: "1" },
      } as Request<{ id: string }, {}, typeof mockUserUpdate>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockError = new Error("Error updating user");

      userService.updateUser = jest.fn().mockRejectedValue(mockError); // Mock error response
      // Spy on sendErrorResponse
      const sendErrorSpy = jest.spyOn(responseHelper, "sendErrorResponse").mockImplementation();

      await userController.updateUser(mockRequest, mockResponse);

      expect(sendErrorSpy).toHaveBeenCalledWith(mockResponse, 400, expect.any(String), mockError);
      // Restore spy (optional for consistency across tests)
      sendErrorSpy.mockRestore();
    });
  });
});
