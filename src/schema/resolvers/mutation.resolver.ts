import { GraphQLContext } from '../../app/context';
import { BookRecord } from '../../domain/models';
import { validateId } from '../../domain/validation';
import { createInvalidIdError } from '../../domain/errors';
import { sanitizeId } from '../../utils/sanitization';

/**
 * Resolvers for Mutation operations
 */
export const Mutation = {
  /**
   * Checks out a book to a person
   * @param _parent - Unused (root mutation)
   * @param args - Mutation arguments containing bookId and personId
   * @param context - GraphQL context containing libraryService
   * @returns Updated book record
   * @throws GraphQLError if validation fails, book not found, person not found, or book already checked out
   */
  checkOutBook(
    _parent: unknown,
    args: { bookId: string; personId: string },
    context: GraphQLContext
  ): BookRecord {
    // Validate bookId
    const bookIdValidation = validateId(args.bookId);
    if (!bookIdValidation.valid) {
      throw createInvalidIdError('bookId', args.bookId);
    }

    // Validate personId
    const personIdValidation = validateId(args.personId);
    if (!personIdValidation.valid) {
      throw createInvalidIdError('personId', args.personId);
    }

    // Sanitize inputs
    const sanitizedBookId = sanitizeId(args.bookId);
    const sanitizedPersonId = sanitizeId(args.personId);

    return context.libraryService.checkOutBook(sanitizedBookId, sanitizedPersonId);
  },

  /**
   * Returns a checked-out book
   * @param _parent - Unused (root mutation)
   * @param args - Mutation arguments containing bookId
   * @param context - GraphQL context containing libraryService
   * @returns Updated book record
   * @throws GraphQLError if validation fails, book not found, or book not checked out
   */
  returnBook(
    _parent: unknown,
    args: { bookId: string },
    context: GraphQLContext
  ): BookRecord {
    // Validate bookId
    const bookIdValidation = validateId(args.bookId);
    if (!bookIdValidation.valid) {
      throw createInvalidIdError('bookId', args.bookId);
    }

    // Sanitize input
    const sanitizedBookId = sanitizeId(args.bookId);

    return context.libraryService.returnBook(sanitizedBookId);
  },
};
