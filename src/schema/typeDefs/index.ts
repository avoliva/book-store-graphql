const bookTypeDef = /* GraphQL */ `
  type Book {
    id: ID!
    title: String!
    author: String!
    isCheckedOut: Boolean!
    checkedOutBy: Person
  }
`;

const personTypeDef = /* GraphQL */ `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    emailAddress: String!
    phoneNumber: String
  }
`;

const queryTypeDef = /* GraphQL */ `
  type Query {
    getAllBooks: [Book!]!
    getBookForId(bookId: ID!): Book!
  }
`;

const mutationTypeDef = /* GraphQL */ `
  type Mutation {
    checkOutBook(bookId: ID!, personId: ID!): Book!
    returnBook(bookId: ID!): Book!
  }
`;

/**
 * Merged GraphQL schema string containing all type definitions
 */
export const typeDefs = bookTypeDef + personTypeDef + queryTypeDef + mutationTypeDef;
