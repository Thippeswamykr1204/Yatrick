import { createApp } from '@/app.js';
import { connectDatabase } from '@/config/database.js';
import { config } from '@/config/env.js';
import logger from '@/utils/logger.js';

const startServer = async () => {
  try {
    logger.info('🚀 Starting AI Travel Planner Backend...');
    
    // Validate environment
    logger.info(`📋 Environment: ${config.env}`);
    logger.info(`🔑 Environment validation: PASSED`);

    // Connect to database
    logger.info('🔗 Connecting to MongoDB...');
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, config.host, () => {
      logger.info(`✅ Server is running on http://${config.host}:${config.port}`);
      logger.info(`📝 Health check: http://${config.host}:${config.port}/health`);
      logger.info(`🎯 API Status: http://${config.host}:${config.port}/api/status`);
      logger.info('');
      logger.info('💡 Tip: Ready for Phase 3 (Authentication)');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n📩 ${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('✅ HTTP server closed');
        
        try {
          // Import disconnect function
          const { disconnectDatabase } = await import('@/config/database.js');
          await disconnectDatabase();
          logger.info('✅ Database disconnected');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('❌ Forced shutdown - graceful shutdown took too long');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      logger.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });

    // Unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();