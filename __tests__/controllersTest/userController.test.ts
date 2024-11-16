import { Request, Response } from "express";
import { userController } from "../../src/controllers/user"; // Adjust the path based on your project
import { userDao } from "../../src/dao/user"; // Adjust path
import prisma from "../../src/prisma"; // Adjust path

// Mocking userDao and prisma
jest.mock("../../src/dao/user", () => ({
  userDao: {
    createUser: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
}));

jest.mock("../../src/prisma", () => ({
  prisma: jest.fn(),
}));

describe("userController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    // Set up mocks for Request and Response objects
    statusMock = jest.fn().mockReturnThis(); // Allows chaining of `.status().send()`
    sendMock = jest.fn();

    mockRequest = {
      body: { name: "John", email: "john@example.com" }, // Example request body
      params: { id: "1" }, // Example params for getUser and updateUser
    };

    mockResponse = {
      status: statusMock,
      send: sendMock,
    };
  });

  describe("createUser", () => {
    it("should create a new user and send a success response", async () => {
      const mockUserData = { id: 1, name: "John", email: "john@example.com" };

      (userDao.createUser as jest.Mock).mockResolvedValue(mockUserData); // Mock successful response

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(userDao.createUser).toHaveBeenCalledWith(prisma, mockRequest.body);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockUserData);
    });

    it("should handle errors and send a failure response", async () => {
      const mockError = new Error("Database error");

      (userDao.createUser as jest.Mock).mockRejectedValue(mockError); // Mock error response

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(mockError);
    });
  });

  describe("getUserDetails", () => {
    it("should retrieve user details and send a success response", async () => {
      const mockUserData = { id: 1, name: "John", email: "john@example.com" };

      (userDao.getUser as jest.Mock).mockResolvedValue(mockUserData); // Mock successful response

      await userController.getUserDetails(mockRequest as Request, mockResponse as Response);

      expect(userDao.getUser).toHaveBeenCalledWith(prisma, 1); // Testing the id parsing
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockUserData);
    });

    it("should handle errors and send a failure response if id is missing", async () => {
      mockRequest.params = {}; // Simulate missing id

      const mockError = new Error("id is required");

      await userController.getUserDetails(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(mockError);
    });
  });

  describe("updateUser", () => {
    it("should update a user and send a success response", async () => {
      const mockUpdatedUser = { id: 1, name: "John Updated", email: "johnupdated@example.com" };

      (userDao.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser); // Mock successful response

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(userDao.updateUser).toHaveBeenCalledWith(prisma, 1, mockRequest.body); // Testing the id parsing
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("should handle errors and send a failure response", async () => {
      const mockError = new Error("Update failed");

      (userDao.updateUser as jest.Mock).mockRejectedValue(mockError); // Mock error response

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(mockError);
    });
  });
});
