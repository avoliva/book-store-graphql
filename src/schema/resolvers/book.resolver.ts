import { GraphQLContext } from '../../app/context';
import { BookRecord, PersonRecord } from '../../domain/models';

/**
 * Field resolvers for Book type
 */
export const Book = {
  /**
   * Computes isCheckedOut from checkedOutById to maintain single source of truth
   * This prevents data inconsistency bugs from updating one field but not the other
   * @param parent - The BookRecord object
   * @returns true if book is checked out, false otherwise
   */
  isCheckedOut(parent: BookRecord): boolean {
    return parent.checkedOutById !== null;
  },

  /**
   * Lazy loads Person data only when checkedOutBy field is requested
   * GraphQL runtime automatically only calls this resolver when checkedOutBy is in the query selection set
   * @param parent - The BookRecord object
   * @param _args - Unused arguments
   * @param context - GraphQL context containing stores
   * @returns PersonRecord if found, null if book not checked out or person not found
   */
  checkedOutBy(
    parent: BookRecord,
    _args: Record<string, never>,
    context: GraphQLContext
  ): PersonRecord | null {
    if (!parent.checkedOutById) {
      context.logger.debug(`Book ${parent.id} not checked out, skipping Person lookup`);
      return null;
    }
    context.logger.debug(`Lazy loading Person data for book ${parent.id}`, {
      bookId: parent.id,
      personId: parent.checkedOutById,
    });
    const person = context.personStore.get(parent.checkedOutById);
    if (person) {
      context.logger.debug(`Person data loaded for book ${parent.id}`, {
        bookId: parent.id,
        personId: person.id,
        personName: `${person.firstName} ${person.lastName}`,
      });
    }
    return person ?? null;
  },
};
