import { contactLogController } from "../../src/controllers/contactLog";
import { Request, Response } from "express";
import { contactLogDao } from "../../src/dao/contactLog";
import prisma from "../../src/prisma";

// Mock the dependencies
jest.mock("../../src/dao/contactLog", () => ({
  contactLogDao: {
    createContactLog: jest.fn(),
    getContactLog: jest.fn(),
    updateContactLog: jest.fn(),
  },
}));

jest.mock("../../src/prisma", () => ({
  // You can mock prisma methods if necessary, for example:
  // user: { findMany: jest.fn() },
}));

describe("contactLogController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let sendMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Create mock functions for the response
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });

    res = {
      status: statusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createContactLog", () => {
    it("should create a new contact log and return the result", async () => {
      const mockContactLogData = {
        message: "Test message",
        userId: 1,
        contactDate: new Date(),
      };

      req = {
        body: mockContactLogData,
      };

      // Mock the `createContactLog` method in contactLogDao
      (contactLogDao.createContactLog as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockContactLogData,
      });

      await contactLogController.createContactLog(req as Request, res as Response);

      expect(contactLogDao.createContactLog).toHaveBeenCalledWith(prisma, mockContactLogData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({ id: 1, ...mockContactLogData });
    });

    it("should return an error if creating contact log fails", async () => {
      const invalidContactLogData = {
        message: "Test message",
        userId: null, // Invalid data
        contactDate: new Date(),
      };

      req = {
        body: invalidContactLogData,
      };

      // Mock the `createContactLog` to throw an error
      (contactLogDao.createContactLog as jest.Mock).mockRejectedValue(new Error("Invalid data"));

      await contactLogController.createContactLog(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error("Invalid data"));
    });
  });

  describe("getContactLogDetails", () => {
    it("should get contact log details for a valid ID", async () => {
      const mockContactLog = {
        id: 1,
        message: "Test message",
        userId: 1,
        contactDate: new Date(),
      };

      req = {
        params: { id: "1" },
      };

      // Mock the `getContactLog` method in contactLogDao
      (contactLogDao.getContactLog as jest.Mock).mockResolvedValue(mockContactLog);

      await contactLogController.getContactLogDetails(req as Request, res as Response);

      expect(contactLogDao.getContactLog).toHaveBeenCalledWith(prisma, 1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockContactLog);
    });

    it("should return an error if the ID is missing", async () => {
      req = {
        params: {},
      };

      await contactLogController.getContactLogDetails(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error("id is required"));
    });

    it("should return an error if the contact log does not exist", async () => {
      req = {
        params: { id: "999" },
      };

      (contactLogDao.getContactLog as jest.Mock).mockResolvedValue(null);

      await contactLogController.getContactLogDetails(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error("Contact log not found"));
    });
  });

  describe("updateContactLog", () => {
    it("should update the contact log and return the updated result", async () => {
      const mockUpdatedData = {
        message: "Updated message",
      };

      req = {
        body: mockUpdatedData,
        params: { id: "1" },
      };

      // Mock the `updateContactLog` method in contactLogDao
      (contactLogDao.updateContactLog as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockUpdatedData,
      });

      await contactLogController.updateContactLog(req as Request, res as Response);

      expect(contactLogDao.updateContactLog).toHaveBeenCalledWith(prisma, 1, mockUpdatedData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({ id: 1, ...mockUpdatedData });
    });

    it("should return an error if the update fails", async () => {
      const mockUpdatedData = {
        message: "Updated message",
      };

      req = {
        body: mockUpdatedData,
        params: { id: "1" },
      };

      // Mock the `updateContactLog` to throw an error
      (contactLogDao.updateContactLog as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await contactLogController.updateContactLog(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error("Update failed"));
    });
  });
});
