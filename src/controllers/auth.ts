import { Request, Response } from "express";
import { debugLog } from "../services/helper";
import { sendSuccessResponse, sendErrorResponse } from "../services/responseHelper";
import { authService } from "../services/auth";
import { RefreshTokenRequest, SignInRequest, SignUpRequest } from "../types/authTypes";

const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
  try {
      //TODO add body validation

    const data = req.body;
    const result = await authService.signUpUser(data)
    sendSuccessResponse(res, 200, "Successfully signed up user", result);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error signing up user", error);
  }
};

const signIn = async (req: Request<{}, {}, SignInRequest>, res: Response) => {
  try {
      //TODO add body validation

    const data = req.body
    const tokens = await authService.signInUser(data)
    sendSuccessResponse(res, 200, "Successfully signed in", tokens);
  } catch (error) {
    debugLog(error);
    sendErrorResponse(res, 400, "Error signing in", error);
  }
};

  const refreshToken = async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
    try {
      //TODO add body validation
      //TODO check refresh token inside db
      const accessToken = await authService.refreshAccessToken(req.body)
      sendSuccessResponse(res, 200, "Access token refreshed successfully", {accessToken});
    } catch (error) {
      debugLog(error);
      sendErrorResponse(res, 400, "Error refreshing access token", error);
    }
  };

export const authController = { signUp, signIn, refreshToken };
