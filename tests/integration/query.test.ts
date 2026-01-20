import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../../src/schema/typeDefs';
import { resolvers } from '../../src/schema/resolvers';
import { createContext } from '../../src/app/context';
import { gql } from 'graphql-tag';

const GET_ALL_BOOKS_QUERY = gql`
  query GetAllBooks {
    getAllBooks {
      id
      title
      author
      isCheckedOut
    }
  }
`;

const GET_ALL_BOOKS_WITH_PERSON_QUERY = gql`
  query GetAllBooksWithPerson {
    getAllBooks {
      id
      title
      author
      isCheckedOut
      checkedOutBy {
        id
        firstName
        lastName
      }
    }
  }
`;

const GET_BOOK_BY_ID_QUERY = gql`
  query GetBookById($bookId: ID!) {
    getBookForId(bookId: $bookId) {
      id
      title
      author
      isCheckedOut
      checkedOutBy {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

describe('Query Resolvers', () => {
  let server: ApolloServer<ReturnType<typeof createContext>>;
  let context: ReturnType<typeof createContext>;

  beforeEach(() => {
    context = createContext();
    server = new ApolloServer<ReturnType<typeof createContext>>({
      typeDefs,
      resolvers,
    });
  });

  describe('getAllBooks', () => {
    it('should return all books without fetching Person data when checkedOutBy not requested', async () => {
      const getSpy = jest.spyOn(context.personStore, 'get');

      const result = await server.executeOperation(
        {
          query: GET_ALL_BOOKS_QUERY,
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.getAllBooks).toBeDefined();
        const books = result.body.singleResult.data?.getAllBooks as Array<{
          id: string;
          title: string;
          author: string;
          isCheckedOut: boolean;
        }>;
        expect(books.length).toBeGreaterThan(0);
      }

      expect(getSpy).not.toHaveBeenCalled();
      getSpy.mockRestore();
    });

    it('should fetch Person data only for checked-out books when checkedOutBy is requested', async () => {
      const getSpy = jest.spyOn(context.personStore, 'get');

      const result = await server.executeOperation(
        {
          query: GET_ALL_BOOKS_WITH_PERSON_QUERY,
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.getAllBooks).toBeDefined();
      }

      const allBooks = context.bookStore.getAll();
      const expectedCallCount = allBooks.filter(
        (book) => book.checkedOutById !== null
      ).length;

      expect(getSpy).toHaveBeenCalledTimes(expectedCallCount);
      getSpy.mockRestore();
    });
  });

  describe('getBookForId', () => {
    it('should return a book by ID', async () => {
      const result = await server.executeOperation(
        {
          query: GET_BOOK_BY_ID_QUERY,
          variables: { bookId: '1' },
        },
        {
          contextValue: context,
        }
      );

      expect(result.body.kind).toBe('single');
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data?.getBookForId).toBeDefined();
        const book = result.body.singleResult.data?.getBookForId as {
          id: string;
          title: string;
        };
        expect(book.id).toBe('1');
        expect(book.title).toBeDefined();
      }
    });

    it('should throw error for non-existent book', async () => {
      const result = await server.executeOperation(
        {
          query: GET_BOOK_BY_ID_QUERY,
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
  });
});
