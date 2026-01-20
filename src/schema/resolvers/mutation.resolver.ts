import { GraphQLContext } from '../../app/context';
import { BookRecord } from '../../domain/models';
import { validateId } from '../../domain/validation';
import { createValidationError } from '../../domain/errors';
import { normalizeId } from '../../utils/normalization';

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
      throw createValidationError('bookId', bookIdValidation.error || 'Invalid ID format');
    }

    // Validate personId
    const personIdValidation = validateId(args.personId);
    if (!personIdValidation.valid) {
      throw createValidationError('personId', personIdValidation.error || 'Invalid ID format');
    }

    // Normalize inputs (trim whitespace only)
    const normalizedBookId = normalizeId(args.bookId);
    const normalizedPersonId = normalizeId(args.personId);

    return context.libraryService.checkOutBook(normalizedBookId, normalizedPersonId);
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
      throw createValidationError('bookId', bookIdValidation.error || 'Invalid ID format');
    }

    // Normalize input (trim whitespace only)
    const normalizedBookId = normalizeId(args.bookId);

    return context.libraryService.returnBook(normalizedBookId);
  },
};
