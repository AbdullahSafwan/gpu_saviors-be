import { bookingController } from '../../src/controllers/booking';
import { Request, Response } from 'express';
import { bookingDao } from '../../src/dao/booking';
import prisma from '../../src/prisma';
import { booking_item } from '@prisma/client';

// Mock the dependencies
jest.mock('../../src/dao/booking', () => ({
  bookingDao: {
    createBooking: jest.fn(),
    getBooking: jest.fn(),
    updateBooking: jest.fn(),
  },
}));

jest.mock('../../src/prisma', () => ({
  // Add any mock prisma methods that may be used
}));

describe('bookingController', () => {
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

  describe('createBooking', () => {
    it('should create a new booking and return a result', async () => {
      const mockBookingData = {
        booking_items: [
          { payableAmount: 100 },
          { payableAmount: 200 },
        ],
        code: 'ABC123',
        payableAmount: 300,
      };

      req = {
        body: mockBookingData,
      };

      // Mock the behavior of the `createBooking` method in bookingDao
      (bookingDao.createBooking as jest.Mock).mockResolvedValue({ success: true });

      await bookingController.createBooking(req as Request, res as Response);

      expect(bookingDao.createBooking).toHaveBeenCalledWith(prisma, mockBookingData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({ success: true });
    });

    it('should return an error if the data is invalid', async () => {
      const invalidBookingData = {
        booking_items: [],
        code: '',
        payableAmount: 0,
      };

      req = {
        body: invalidBookingData,
      };

      // Mock the `createBooking` to throw an error
      (bookingDao.createBooking as jest.Mock).mockRejectedValue(new Error('Invalid data'));

      await bookingController.createBooking(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error('Invalid data'));
    });
  });

  describe('getBookingDetails', () => {
    it('should get booking details for a valid ID', async () => {
      const mockBooking = {
        id: 1,
        code: 'ABC123',
        payableAmount: 300,
        booking_items: [],
      };

      req = {
        params: { id: '1' },
      };

      (bookingDao.getBooking as jest.Mock).mockResolvedValue(mockBooking);

      await bookingController.getBookingDetails(req as Request, res as Response);

      expect(bookingDao.getBooking).toHaveBeenCalledWith(prisma, 1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockBooking);
    });

    it('should return an error if the ID is missing', async () => {
      req = {
        params: {},
      };

      await bookingController.getBookingDetails(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error('id is required'));
    });
  });

  describe('updateBooking', () => {
    it('should update the booking and return the updated result', async () => {
      const mockBookingUpdate = {
        code: 'ABC123',
        payableAmount: 350,
      };

      req = {
        body: mockBookingUpdate,
        params: { id: '1' },
      };

      (bookingDao.updateBooking as jest.Mock).mockResolvedValue({ success: true });

      await bookingController.updateBooking(req as Request, res as Response);

      expect(bookingDao.updateBooking).toHaveBeenCalledWith(prisma, 1, mockBookingUpdate);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({ success: true });
    });

    it('should return an error if the update fails', async () => {
      const mockBookingUpdate = {
        code: 'ABC123',
        payableAmount: 350,
      };

      req = {
        body: mockBookingUpdate,
        params: { id: '1' },
      };

      (bookingDao.updateBooking as jest.Mock).mockRejectedValue(new Error('Update failed'));

      await bookingController.updateBooking(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith(new Error('Update failed'));
    });
  });
});
