import { Book } from './book.resolver';
import { Query } from './query.resolver';
import { Mutation } from './mutation.resolver';

/**
 * Merged resolver map combining all GraphQL resolvers
 */
export const resolvers = {
  Book,
  Query,
  Mutation,
};
