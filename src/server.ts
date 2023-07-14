import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorLogger, logger } from './shared/logger';

let server: Server;

async function startServer() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(`🛢 Database is connected successfully`);

    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    errorLogger.error('Failed to connect to the database', err);
    process.exit(1);
  }
}

function gracefulShutdown() {
  if (server) {
    server.close(() => {
      logger.info('Server gracefully closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  errorLogger.error(error);
  gracefulShutdown();
});

startServer().catch(error => {
  errorLogger.error('Failed to start the server', error);
  process.exit(1);
});
