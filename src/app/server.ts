import { ApolloServer } from '@apollo/server';
import { GraphQLContext } from './context';
import { typeDefs } from '../schema/typeDefs';
import { resolvers } from '../schema/resolvers';

/**
 * Creates and configures an Apollo Server instance
 * @returns Configured Apollo Server instance
 */
export function createServer(): ApolloServer<GraphQLContext> {
  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });
}
