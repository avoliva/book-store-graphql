import { GraphQLContext } from '../../app/context';
import { BookRecord, PersonRecord } from '../../domain/models';
import { createBookNotFoundError, createValidationError } from '../../domain/errors';
import { validateId } from '../../domain/validation';
import { normalizeId } from '../../utils/normalization';

export const Query = {
  getAllBooks(
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext
  ): BookRecord[] {
    context.logger.debug('Query: getAllBooks');
    return context.bookStore.getAll();
  },

  /**
   * @param args - Query arguments containing bookId
   * @param context - GraphQL context containing stores
   */
  getBookForId(
    _parent: unknown,
    args: { bookId: string },
    context: GraphQLContext
  ): BookRecord {
    context.logger.debug('Query: getBookForId', { bookId: args.bookId });
    const bookIdValidation = validateId(args.bookId);
    if (!bookIdValidation.valid) {
      throw createValidationError('bookId', bookIdValidation.error || 'Invalid ID format');
    }

    const id = normalizeId(args.bookId);

    const book = context.bookStore.get(id);
    if (!book) {
      throw createBookNotFoundError(id);
    }
    return book;
  },

  getPersons(
    _parent: unknown,
    _args: Record<string, never>,
    context: GraphQLContext
  ): PersonRecord[] {
    return context.personStore.getAll();
  }
};
