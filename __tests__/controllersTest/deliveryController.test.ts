import { Request, Response } from "express";
import { deliveryController } from "../../src/controllers/delivery"; // adjust the path
import { deliveryDao } from "../../src/dao/delivery"; // adjust the path
import prisma from "../../src/prisma"; // adjust the path to your Prisma instance

// Type the methods of deliveryDao as Jest mocks
jest.mock("../../src/dao/delivery");

describe("Delivery Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  // Type the deliveryDao mock methods
  const mockCreateDelivery = deliveryDao.createDelivery as jest.Mock;
  const mockGetDelivery = deliveryDao.getDelivery as jest.Mock;
  const mockUpdateDelivery = deliveryDao.updateDelivery as jest.Mock;

  beforeEach(() => {
    // Mocking express Request and Response objects
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for createDelivery
  describe("createDelivery", () => {
    it("should create a delivery successfully", async () => {
      const mockData = { status: "Pending", bookingId: 123 };
      const mockResult = { id: 1, ...mockData };

      mockCreateDelivery.mockResolvedValue(mockResult);

      req.body = mockData;

      await deliveryController.createDelivery(req as Request, res as Response);

      expect(mockCreateDelivery).toHaveBeenCalledWith(prisma, mockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockResult);
    });

    it("should return error when createDelivery fails", async () => {
      const mockError = new Error("Failed to create delivery");

      mockCreateDelivery.mockRejectedValue(mockError);

      req.body = { status: "Pending", bookingId: 123 };

      await deliveryController.createDelivery(req as Request, res as Response);

      expect(mockCreateDelivery).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(mockError);
    });
  });

  // Test for getDeliveryDetails
  describe("getDeliveryDetails", () => {
    it("should return delivery details successfully", async () => {
      const mockId = 1;
      const mockDelivery = { id: mockId, status: "Delivered" };
      req.params = { id: mockId.toString() };

      mockGetDelivery.mockResolvedValue(mockDelivery);

      await deliveryController.getDeliveryDetails(req as Request, res as Response);

      expect(mockGetDelivery).toHaveBeenCalledWith(prisma, mockId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockDelivery);
    });

    it("should return error when id is not provided", async () => {
      req.params = { id: "" };

      await deliveryController.getDeliveryDetails(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(new Error("id is required"));
    });

    it("should return error when delivery is not found", async () => {
      const mockId = 1;
      const mockError = new Error("Delivery not found");
      req.params = { id: mockId.toString() };

      mockGetDelivery.mockResolvedValue(null); // Simulate no data found

      await deliveryController.getDeliveryDetails(req as Request, res as Response);

      expect(mockGetDelivery).toHaveBeenCalledWith(prisma, mockId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(mockError);
    });
  });

  // Test for updateDelivery
  describe("updateDelivery", () => {
    it("should update a delivery successfully", async () => {
      const mockId = 1;
      const mockData = { status: "Shipped" };
      const mockResult = { id: mockId, ...mockData };
      req.params = { id: mockId.toString() };
      req.body = mockData;

      mockUpdateDelivery.mockResolvedValue(mockResult);

      await deliveryController.updateDelivery(req as Request, res as Response);

      expect(mockUpdateDelivery).toHaveBeenCalledWith(prisma, mockId, mockData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockResult);
    });

    it("should return error when updateDelivery fails", async () => {
      const mockId = 1;
      const mockData = { status: "Failed" };
      const mockError = new Error("Failed to update delivery");

      req.params = { id: mockId.toString() };
      req.body = mockData;

      mockUpdateDelivery.mockRejectedValue(mockError);

      await deliveryController.updateDelivery(req as Request, res as Response);

      expect(mockUpdateDelivery).toHaveBeenCalledWith(prisma, mockId, mockData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(mockError);
    });
  });
});
