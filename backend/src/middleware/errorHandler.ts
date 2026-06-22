import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@/utils/errors.js';
import { sendError } from '@/utils/apiResponse.js';
import logger from '@/utils/logger.js';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  if (error instanceof AppError) {
    sendError(res, error.message, error.statusCode, error);
    return;
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const validationError = new ValidationError('Validation failed');
    sendError(res, validationError.message, validationError.statusCode, validationError);
    return;
  }

  // Handle Mongoose duplicate key errors
  if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
    const fieldName = Object.keys((error as any).keyValue)[0];
    sendError(res, `${fieldName} already exists`, 409, error);
    return;
  }

  // Generic error handling
  sendError(res, 'Internal server error', 500, error);
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };