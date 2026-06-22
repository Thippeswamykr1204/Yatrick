import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().default(5000),

  // Default localhost for local development
  HOST: z.string().default('localhost'),

  MONGODB_URI: z.string().url('Invalid MongoDB URI'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  JWT_REFRESH_SECRET: z.string().min(
    32,
    'JWT_REFRESH_SECRET must be at least 32 characters'
  ),

  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  GEMINI_API_KEY: z.string().min(
    1,
    'GEMINI_API_KEY is required'
  ),

  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  FRONTEND_URL_PROD: z.string().url().optional(),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');

    error.errors.forEach((err) => {
      console.error(`   ${err.path.join('.')}: ${err.message}`);
    });

    process.exit(1);
  }

  throw error;
}

export const config = {
  env: env.NODE_ENV,

  port: env.PORT,

  // IMPORTANT: Render requires 0.0.0.0
  host:
    env.NODE_ENV === 'production'
      ? '0.0.0.0'
      : env.HOST,

  mongodb: {
    uri: env.MONGODB_URI,
  },

  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRY,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRY,
  },

  gemini: {
    apiKey: env.GEMINI_API_KEY,
  },

  frontend: {
    url:
      env.NODE_ENV === 'production'
        ? env.FRONTEND_URL_PROD
        : env.FRONTEND_URL,
  },

  logging: {
    level: env.LOG_LEVEL,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
} as const;

export default config;