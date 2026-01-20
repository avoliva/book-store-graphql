import { GraphQLContext } from '../../app/context';
import { BookRecord, PersonRecord } from '../../domain/models';

export const Person = {


  /**
   * @param parent - The BookRecord object
   * @param _args - Unused arguments
   * @param context - GraphQL context containing stores
   * @returns PersonRecord if found, null if book not checked out or person not found
   */
  checkedOutBooks(
    parent: PersonRecord,
    _args: Record<string, never>,
    context: GraphQLContext
  ): BookRecord[] | null {

    return context.personStore.get(parent.checkedOutById) ?? null;
  },
};
