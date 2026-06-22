import cors from 'cors';
import { config } from '@/config/env.js';
import logger from '@/utils/logger.js';

const allowedOrigins = [
  config.frontend.url,
  'http://localhost:3000',
  'http://localhost:3001',
];

if (config.env === 'production' && config.frontend.url) {
  allowedOrigins.push(config.frontend.url);
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
});