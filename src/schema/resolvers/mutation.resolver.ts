import { GraphQLContext } from '../../app/context';
import { BookRecord } from '../../domain/models';

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
   * @throws GraphQLError if book not found, person not found, or book already checked out
   */
  checkOutBook(
    _parent: unknown,
    args: { bookId: string; personId: string },
    context: GraphQLContext
  ): BookRecord {
    return context.libraryService.checkOutBook(args.bookId, args.personId);
  },

  /**
   * Returns a checked-out book
   * @param _parent - Unused (root mutation)
   * @param args - Mutation arguments containing bookId
   * @param context - GraphQL context containing libraryService
   * @returns Updated book record
   * @throws GraphQLError if book not found or book not checked out
   */
  returnBook(
    _parent: unknown,
    args: { bookId: string },
    context: GraphQLContext
  ): BookRecord {
    return context.libraryService.returnBook(args.bookId);
  },
};
