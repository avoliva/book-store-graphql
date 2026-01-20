import { MemoryStore } from '../data/memoryStore';
import { Store } from '../data/store';
import { BookRecord, PersonRecord } from '../domain/models';
import { seedData } from '../data/seed';
import { LibraryService } from '../services/libraryService';
import * as winston from 'winston';
import { createLogger } from '../utils/logger';

/**
 * GraphQL context object containing stores, services, and logger
 */
export interface GraphQLContext {
  bookStore: Store<BookRecord>;
  personStore: Store<PersonRecord>;
  libraryService: LibraryService;
  logger: winston.Logger;
}

/**
 * Creates and initializes the GraphQL context with stores and services
 */
export function createContext(): GraphQLContext {
  const logger = createLogger();
  logger.debug('Initializing GraphQL context');

  const bookStore = new MemoryStore<BookRecord>();
  const personStore = new MemoryStore<PersonRecord>();

  const { books, persons } = seedData(bookStore, personStore);
  logger.debug('Seed data loaded', {
    bookCount: books.length,
    personCount: persons.length,
    checkedOutBooks: books.filter((b) => b.checkedOutById !== null).length,
  });

  const libraryService = new LibraryService(bookStore, personStore, logger);
  logger.debug('GraphQL context initialized successfully');

  return {
    bookStore,
    personStore,
    libraryService,
    logger,
  };
}
