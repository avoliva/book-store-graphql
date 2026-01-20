import { GraphQLContext } from '../../app/context';
import { BookRecord } from '../../domain/models';
import { createBookNotFoundError } from '../../domain/errors';

/**
 * Resolvers for Query operations
 */
export const Query = {
  /**
   * Returns all books without loading Person data
   * Person data only loaded if checkedOutBy field is requested (via field resolver)
   * @param _parent - Unused (root query)
   * @param _args - Unused (no arguments)
   * @param context - GraphQL context containing stores
   * @returns Array of all book records
   */
  getAllBooks(
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext
  ): BookRecord[] {
    context.logger.debug('getAllBooks query executed', {
      timestamp: new Date().toISOString(),
    });
    const books = context.bookStore.getAll();
    context.logger.debug(`getAllBooks returning ${books.length} books`);
    return books;
  },

  /**
   * Returns a single book by ID
   * @param _parent - Unused (root query)
   * @param args - Query arguments containing bookId
   * @param context - GraphQL context containing stores
   * @returns Book record
   * @throws GraphQLError if book not found
   */
  getBookForId(
    _parent: unknown,
    args: { bookId: string },
    context: GraphQLContext
  ): BookRecord {
    context.logger.debug(`getBookForId query executed`, {
      bookId: args.bookId,
      timestamp: new Date().toISOString(),
    });
    const book = context.bookStore.get(args.bookId);
    if (!book) {
      context.logger.debug(`Book ${args.bookId} not found`);
      throw createBookNotFoundError(args.bookId);
    }
    context.logger.debug(`Book ${args.bookId} found: ${book.title}`);
    return book;
  },
};
