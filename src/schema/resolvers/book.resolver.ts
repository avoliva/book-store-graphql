import { GraphQLContext } from '../../app/context';
import { BookRecord, PersonRecord } from '../../domain/models';

export const Book = {
  /**
   * @param parent - The BookRecord object
   * @returns true if book is checked out, false otherwise
   */
  isCheckedOut(parent: BookRecord): boolean {
    return parent.checkedOutById !== null;
  },

  /**
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
      return null;
    }
    return context.personStore.get(parent.checkedOutById) ?? null;
  },
};
