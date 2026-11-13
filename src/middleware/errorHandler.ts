import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/error";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let errorCode = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let isOperational = false;
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    isOperational = err.isOperational;

    if (err instanceof ValidationError) {
      details = err.details;
    }
  } else if (err.name === "QueryFailedError") {
    statusCode = 400;
    errorCode = "DATABASE_ERROR";
    message = "Database operation failed";
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    errorCode = "INVALID_JSON";
    message = "Invalid JSON in request body";
  }

  if (isOperational) {
    logger.warn(`Operational error: ${message}`, {
      errorCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error("Unexpected error:", {
      error: err,
      path: req.path,
      method: req.method,
    });
  }

  
res.status(statusCode).json({
  success: false,
  error: {
    code: errorCode,
    message,
    ...(details !== undefined ? { details } : {}),
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  },
});

};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};