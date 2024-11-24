import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";

export const throwValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    const errors: ValidationError[] = valResult.array();
    return res.status(400).json({ errors });
  }
  next();
};

// Create a utility function to get line number, file name, and function name
export function getDebugInfo() {
  try {
    throw new Error();
  } catch (e: any) {
    const stackLines = e.stack?.split("\n") || [];
    // Assuming that the third line of the stack trace contains the file and line information
    const callerLine = stackLines[3] || "";
    // const matchResult = callerLine.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
    if (callerLine) {
      return {
        // functionName: matchResult[1],
        // fileName: matchResult[2],
        // lineNumber: matchResult[3],
        errorLocation: callerLine,
      };
    } else {
      return {
        // functionName: 'UnknownFunction',
        // fileName: 'UnknownFile',
        // lineNumber: 'UnknownLine',
        errorLocation: "UnknownLocation",
      };
    }
  }
}

// Create a wrapper function for debugLog with debug information
export function debugLog(...args: any[]) {
  const { errorLocation } = getDebugInfo();
  console.log(`${errorLocation}`, ...args);
}
