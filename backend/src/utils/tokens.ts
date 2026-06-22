import jwt from 'jsonwebtoken';
import { config } from '@/config/env.js';
import logger from './logger.js';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  try {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: 'ai-travel-planner-api',
      audience: 'ai-travel-planner-frontend',
    } as any);
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw error;
  }
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  try {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'ai-travel-planner-api',
      audience: 'ai-travel-planner-frontend',
    } as any);
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw error;
  }
};

/**
 * Generate both tokens
 */
export const generateTokens = (
  payload: TokenPayload
): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'ai-travel-planner-api',
      audience: 'ai-travel-planner-frontend',
    }) as DecodedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'ai-travel-planner-api',
      audience: 'ai-travel-planner-frontend',
    }) as DecodedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};