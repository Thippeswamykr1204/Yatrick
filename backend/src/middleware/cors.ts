import cors from 'cors';
import { config } from '@/config/env.js';
import logger from '@/utils/logger.js';

const allowedOrigins = [
  'http://localhost:3000',
  'https://yatrick.vercel.app',
];

if (config.frontend.url) {
  allowedOrigins.push(config.frontend.url);
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`CORS blocked request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});