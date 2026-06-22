import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { corsMiddleware } from '@/middleware/cors.js';
import { errorHandler, asyncHandler } from '@/middleware/errorHandler.js';
import { sendSuccess } from '@/utils/apiResponse.js';
import apiRoutes from '@/routes/index.js';
import logger from '@/utils/logger.js';
import { config } from '@/config/env.js';

export const createApp = (): Express => {
  const app = express();

  // ==================== SECURITY MIDDLEWARE ====================
  app.use(helmet());

  // ==================== BODY PARSING MIDDLEWARE ====================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // ==================== COOKIE PARSING ====================
  // Using built-in express.json() doesn't parse cookies
  // We need to add a simple cookie parser
  app.use((req: Request, res: Response, next: NextFunction) => {
    const cookies: Record<string, string> = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach((cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          cookies[key] = decodeURIComponent(value);
        }
      });
    }
    req.cookies = cookies;
    next();
  });

  // ==================== CORS MIDDLEWARE ====================
  app.use(corsMiddleware);

  // ==================== REQUEST LOGGING MIDDLEWARE ====================
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - (req.startTime || Date.now());
      const level = res.statusCode >= 400 ? 'warn' : 'info';
      
      logger[level as keyof typeof logger](`${req.method} ${req.path}`, {
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
      });
    });

    next();
  });

  // ==================== HEALTH CHECK ENDPOINT ====================
  app.get('/health', (req: Request, res: Response) => {
    return sendSuccess(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  app.get('/api/health', (req: Request, res: Response) => {
    return sendSuccess(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
    });
  });

  // ==================== API ROUTES ====================
  app.use('/api', apiRoutes);

  app.get('/api/status', (req: Request, res: Response) => {
    return sendSuccess(res, {
      message: 'API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== 404 HANDLER ====================
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      status: 404,
      message: `Route ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  });

  // ==================== ERROR HANDLER (MUST BE LAST) ====================
  app.use(errorHandler);

  return app;
};