import { startStandaloneServer } from '@apollo/server/standalone';
import { createServer } from './app/server';
import { createContext } from './app/context';
import { Logger, createLogger } from './utils/logger';

/**
 * Main application entry point
 * Creates GraphQL server, starts it, and sets up graceful shutdown handlers
 */
async function main(): Promise<void> {
  const logger: Logger = createLogger();
  const context = createContext();
  const server = createServer();

  const { url } = await startStandaloneServer(server, {
    context: async () => context,
    listen: { port: 4000 },
  });

  logger.info(`Server ready at ${url}`);

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down gracefully`);
    await server.stop();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  const logger = createLogger();
  logger.error('Fatal error:', error);
  process.exit(1);
});
