import { startStandaloneServer } from '@apollo/server/standalone';
import { createServer } from './app/server';
import { createContext } from './app/context';
import { createLogger } from './utils/logger';

async function main(): Promise<void> {
  const logger = createLogger();
  const context = createContext();
  const server = createServer();

  const { url } = await startStandaloneServer(server, {
    context: async () => context,
    listen: { port: 4000 },
  });

  logger.info(`Server ready at ${url}`);

  /**
   * @param signal - The shutdown signal received
   */
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
