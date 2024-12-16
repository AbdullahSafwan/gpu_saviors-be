import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { authService } from "../services/auth";
import {
  RefreshTokenRequest,
  LogInRequest,
  SignUpRequest,
  VerifyMailRequest,
  VerifyTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/authTypes";

const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  try {
    //TODO add body validation

    const data = req.body;
    const result = await authService.signUpUser(data);
    sendSuccessResponse(res, 200, "Successfully signed up user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error signing up user", error);
  }
};

const logIn = async (req: Request<{}, {}, LogInRequest>, res: Response) => {
  try {
    //TODO add body validation

    const data = req.body;
    const tokens = await authService.logInUser(data);
    sendSuccessResponse(res, 200, "Successfully signed in", tokens);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error logging in", error);
  }
};

const refreshToken = async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
  try {
    const accessToken = await authService.refreshAccessToken(req.body);
    sendSuccessResponse(res, 200, "Access token refreshed successfully", { accessToken });
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error refreshing access token", error);
  }
};

const logOut = async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
  try {
    if (!req.body.refreshToken) throw new Error("Refresh token required");
    const logout = await authService.logOut(req.body);
    sendSuccessResponse(res, 200, "Logged out successfully", logout);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error logging out", error);
  }
};

const sendVerificationMail = async (req: Request<{}, {}, VerifyMailRequest>, res: Response) => {
  try {
    if (!req.body.email) throw new Error("Email is required");
    const result = await authService.sendVerificationMail(req.body);
    sendSuccessResponse(res, 200, "Verification Mail sent successfully", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error sending verification mail", error);
  }
};

const verifyEmail = async (req: Request<{}, {}, VerifyTokenRequest>, res: Response) => {
  try {
    if (!req.body.token) throw new Error("Token is required");
    const result = await authService.verifyEmail(req.body);
    sendSuccessResponse(res, 200, "Logged out successfully", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error logging out", error);
  }
};

const forgotPassword = async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
  try {
    if (!req.body.email) throw new Error("Email is required");

    const result = await authService.forgotPassword(req.body);
    sendSuccessResponse(res, 200, "Password reset link sent successfully", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error sending password reset email", error);
  }
};

const resetPassword = async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
  try {
    if (!req.body.newPassword) throw new Error("New password is required");
    if (!req.body.token) throw new Error("Token is required");

    const result = await authService.resetPassword(req.body);
    sendSuccessResponse(res, 200, "Password reset successfully", { result });
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error sending password reset email", error);
  }
};

export const authController = {
  signUp,
  logIn,
  refreshToken,
  logOut,
  sendVerificationMail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
