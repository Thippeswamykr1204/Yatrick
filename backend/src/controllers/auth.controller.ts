import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserById,
  logoutUser,
} from '@/services/auth.service.js';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} from '@/validators/auth.validators.js';
import { sendSuccess, sendError } from '@/utils/apiResponse.js';
import { ValidationError } from '@/utils/errors.js';
import logger from '@/utils/logger.js';

/**
 * Register endpoint handler
 * POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate input
    const validation = validateRegister(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({
          ...acc,
          [err.path[0]]: err.message,
        }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    // Register user
    const result = await registerUser(validation.data);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login endpoint handler
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({
          ...acc,
          [err.path[0]]: err.message,
        }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    // Login user
    const result = await loginUser(validation.data);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token endpoint handler
 * POST /api/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get refresh token from cookie or body
    const refreshTokenFromBody = req.body.refreshToken;
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Validate input
    const validation = validateRefreshToken({ refreshToken });
    if (!validation.success) {
      throw new ValidationError('Invalid refresh token');
    }

    // Refresh access token
    const tokens = await refreshAccessToken(refreshToken);

    // Update refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    sendSuccess(res, tokens, 'Token refreshed successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user endpoint handler
 * GET /api/auth/me
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not found in request');
    }

    const user = await getUserById(req.user.id);
    sendSuccess(res, user, 'User fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout endpoint handler
 * POST /api/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not found in request');
    }

    // Invalidate refresh token in database
    await logoutUser(req.user.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    sendSuccess(res, null, 'Logout successful', 200);
  } catch (error) {
    next(error);
  }
};