import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../../src/schema/typeDefs';
import { resolvers } from '../../src/schema/resolvers';
import { createContext } from '../../src/app/context';
import { gql } from 'graphql-tag';

const CHECKOUT_BOOK_MUTATION = gql`
  mutation CheckOutBook($bookId: ID!, $personId: ID!) {
    checkOutBook(bookId: $bookId, personId: $personId) {
      id
      title
      author
      isCheckedOut
      checkedOutBy {
        id
        firstName
      }
    }
  }
`;

const RETURN_BOOK_MUTATION = gql`
  mutation ReturnBook($bookId: ID!) {
    returnBook(bookId: $bookId) {
      id
      title
      author
      isCheckedOut
    }
  }
`;

describe('Mutation Resolvers', () => {
  let server: ApolloServer<ReturnType<typeof createContext>>;
  let context: ReturnType<typeof createContext>;

  beforeEach(() => {
    context = createContext();
    server = new ApolloServer<ReturnType<typeof createContext>>({
      typeDefs,
      resolvers,
    });
  });

  describe('checkOutBook', () => {
    it('should successfully check out a book', async () => {
      const result = await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '1', personId: '1' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.checkOutBook).toBeDefined();
        const book = result.body.singleResult.data?.checkOutBook as {
          id: string;
          isCheckedOut: boolean;
        };
        expect(book.id).toBe('1');
        expect(book.isCheckedOut).toBe(true);
      }
    });

    it('should throw error for non-existent book', async () => {
      const result = await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '999', personId: '1' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('BOOK_NOT_FOUND');
      }
    });

    it('should throw error for non-existent person', async () => {
      const result = await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '1', personId: '999' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('PERSON_NOT_FOUND');
      }
    });

    it('should throw error if book already checked out', async () => {
      await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '2', personId: '1' },
        },
        {
          contextValue: context,
        }
      );

      const result = await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '2', personId: '2' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('BOOK_ALREADY_CHECKED_OUT');
      }
    });
  });

  describe('returnBook', () => {
    it('should successfully return a checked-out book', async () => {
      await server.executeOperation(
        {
          query: CHECKOUT_BOOK_MUTATION,
          variables: { bookId: '3', personId: '1' },
        },
        {
          contextValue: context,
        }
      );

      const result = await server.executeOperation(
        {
          query: RETURN_BOOK_MUTATION,
          variables: { bookId: '3' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.returnBook).toBeDefined();
        const book = result.body.singleResult.data?.returnBook as {
          id: string;
          isCheckedOut: boolean;
        };
        expect(book.id).toBe('3');
        expect(book.isCheckedOut).toBe(false);
      }
    });

    it('should throw error for non-existent book', async () => {
      const result = await server.executeOperation(
        {
          query: RETURN_BOOK_MUTATION,
          variables: { bookId: '999' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('BOOK_NOT_FOUND');
      }
    });

    it('should throw error if book not checked out', async () => {
      const result = await server.executeOperation(
        {
          query: RETURN_BOOK_MUTATION,
          variables: { bookId: '1' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined();
        expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('BOOK_NOT_CHECKED_OUT');
      }
    });
  });

  describe('Input Validation', () => {
    describe('checkOutBook', () => {
      it('should throw validation error for empty bookId', async () => {
        const result = await server.executeOperation(
          {
            query: CHECKOUT_BOOK_MUTATION,
            variables: { bookId: '', personId: '1' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('bookId');
        }
      });

      it('should throw validation error for empty personId', async () => {
        const result = await server.executeOperation(
          {
            query: CHECKOUT_BOOK_MUTATION,
            variables: { bookId: '1', personId: '' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('personId');
        }
      });

      it('should throw validation error for whitespace-only bookId', async () => {
        const result = await server.executeOperation(
          {
            query: CHECKOUT_BOOK_MUTATION,
            variables: { bookId: '   ', personId: '1' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('bookId');
        }
      });

      it('should throw validation error for whitespace-only personId', async () => {
        const result = await server.executeOperation(
          {
            query: CHECKOUT_BOOK_MUTATION,
            variables: { bookId: '1', personId: '\t\n' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('personId');
        }
      });

      it('should throw validation error for bookId with leading whitespace', async () => {
        const result = await server.executeOperation(
          {
            query: CHECKOUT_BOOK_MUTATION,
            variables: { bookId: '  1', personId: '1' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
        }
      });
    });

    describe('returnBook', () => {
      it('should throw validation error for empty bookId', async () => {
        const result = await server.executeOperation(
          {
            query: RETURN_BOOK_MUTATION,
            variables: { bookId: '' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('bookId');
        }
      });

      it('should throw validation error for whitespace-only bookId', async () => {
        const result = await server.executeOperation(
          {
            query: RETURN_BOOK_MUTATION,
            variables: { bookId: '   ' },
          },
          {
            contextValue: context,
          }
        );

        expect(result.body.kind).toBe('single');
        if (result.body.kind === 'single') {
          expect(result.body.singleResult.errors).toBeDefined();
          expect(result.body.singleResult.errors?.[0]?.extensions?.code).toBe('INVALID_ID_FORMAT');
          expect(result.body.singleResult.errors?.[0]?.extensions?.field).toBe('bookId');
        }
      });
    });
  });
});
