import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { authService } from "../services/auth";
import { RefreshTokenRequest, LogInRequest, SignUpRequest } from "../types/authTypes";

const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  try {
    //TODO add body validation

    const data = req.body;
    const result = await authService.signUpUser(data);
    sendSuccessResponse(res, 200, "Successfully signed up user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error logging up user", error);
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
    //TODO add body validation
    //TODO check refresh token inside db
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

export const authController = { signUp, logIn, refreshToken, logOut };
