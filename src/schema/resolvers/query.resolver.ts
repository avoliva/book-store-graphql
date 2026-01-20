import { GraphQLContext } from '../../app/context';
import { BookRecord } from '../../domain/models';
import { createBookNotFoundError, createValidationError } from '../../domain/errors';
import { validateId } from '../../domain/validation';
import { normalizeId } from '../../utils/normalization';

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
   * @throws GraphQLError if validation fails or book not found
   */
  getBookForId(
    _parent: unknown,
    args: { bookId: string },
    context: GraphQLContext
  ): BookRecord {
    // Validate bookId
    const bookIdValidation = validateId(args.bookId);
    if (!bookIdValidation.valid) {
      throw createValidationError('bookId', bookIdValidation.error || 'Invalid ID format');
    }

    // Normalize input (trim whitespace only)
    const normalizedBookId = normalizeId(args.bookId);

    context.logger.debug(`getBookForId query executed`, {
      bookId: normalizedBookId,
      timestamp: new Date().toISOString(),
    });
    const book = context.bookStore.get(normalizedBookId);
    if (!book) {
      context.logger.debug(`Book ${normalizedBookId} not found`);
      throw createBookNotFoundError(normalizedBookId);
    }
    context.logger.debug(`Book ${normalizedBookId} found: ${book.title}`);
    return book;
  },
};
