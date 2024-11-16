import { Response } from 'express';
import { debugLog } from './helper';
/**
 * Sends an error response based on the given status code.
 * @param res Express Response object.
 * @param statusCode Number representing the HTTP status code.
 * @param message Error message to be included in the response.
 * @param error Optional. Error object or message associated with the error.
 */
function sendErrorResponse(res: Response, statusCode: number, message: string, error?: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorResponse: { [key: string]: any } = {
    success: false,
    data: null,
    message, // Assuming message is an array with one element
    error: [{ code: statusCode, messages: [message, errorMessage] }],
  };
  debugLog(`Error: ${message}`, error);
  res.status(statusCode).json(errorResponse);
}

/**
 * Sends a success response based on the given status code.
 * @param res Express Response object.
 * @param statusCode Number representing the HTTP status code.
 * @param message Success message or an array of messages to be included in the response.
 * @param payload Optional. Additional data to be included in the response body.
 */
function sendSuccessResponse(res: Response, statusCode: number, message: string | string[], payload?: { [key: string]: any }): void {
  const successResponse: { [key: string]: any } = {
    success: true,
    data: payload || {},
    message,
    error: null,
  };

  res.status(statusCode).json(successResponse);
}

export { sendErrorResponse, sendSuccessResponse };
