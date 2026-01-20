# GraphQL Library System

A simple GraphQL API for checking books in and out of a library. Built with Apollo Server and TypeScript.

## What It Does

You can query books, check them out to people, and return them. The API only loads person information when you actually ask for it, which is the main thing this project demonstrates.

## Getting Started

You need Node.js 24 or higher.

```bash
npm install
npm run build
npm start
```

The server runs on `http://localhost:4000`. Open that URL in your browser to use Apollo Studio.

## Development

```bash
npm run build    # Compile TypeScript
npm test         # Run tests
npm run lint     # Check for linting errors
npm run lint:fix # Auto-fix linting issues
```

## How It Works

The code is organized into a few layers:

- **Domain models** (`src/domain/`) - Book and Person types, business rules, error helpers, validation utilities
- **Data layer** (`src/data/`) - In-memory store using a Map, seed data
- **Services** (`src/services/`) - Business logic for checkout/return operations
- **GraphQL layer** (`src/schema/`) - Schema definitions and resolvers
- **Utilities** (`src/utils/`) - Logging, sanitization utilities

The key design decision is lazy loading. When you query `getAllBooks`, it doesn't fetch any person data. Only when you include `checkedOutBy` in your query does it look up the person. This is handled by a field resolver that only runs when that field is requested.

We also compute `isCheckedOut` from `checkedOutById` instead of storing both. This prevents data inconsistency bugs.

### Input Validation

All user inputs are validated before processing:

- **ID Format Validation**: IDs must be non-empty strings (1-100 characters) with no leading/trailing whitespace and no control characters
- **Input Sanitization**: Inputs are sanitized to remove dangerous characters and trim whitespace
- **Early Validation**: Validation happens at the resolver level before calling the service layer, providing clear error messages

Validation errors return `GraphQLError` with error codes:
- `INVALID_ID_FORMAT` - Invalid ID format (empty, whitespace-only, or contains invalid characters)
- `VALIDATION_ERROR` - Generic validation error
- `INVALID_STRING_LENGTH` - String length outside allowed range

## Example Queries

Get all books without person data:

```graphql
query {
  getAllBooks {
    id
    title
    author
    isCheckedOut
  }
}
```

Get a specific book with person info:

```graphql
query {
  getBookForId(bookId: "2") {
    id
    title
    checkedOutBy {
      firstName
      lastName
      emailAddress
    }
  }
}
```

Check out a book:

```graphql
mutation {
  checkOutBook(bookId: "1", personId: "1") {
    id
    title
    isCheckedOut
  }
}
```

Return a book:

```graphql
mutation {
  returnBook(bookId: "2") {
    id
    title
    isCheckedOut
  }
}
```

## Testing

### Automated Tests

The integration tests verify that:
- Queries work correctly
- Mutations handle errors properly
- Person data is only fetched when requested (lazy loading)

Run tests with `npm test`. To see debug logs during testing, set `LOG_LEVEL=debug` before running.

### Manual Testing - Demo Requirements

Use these queries in Apollo Studio (`http://localhost:4000`) to manually test the demo requirements:

#### Requirement 1: Get All Books Without Person Data

This demonstrates lazy loading - Person data is NOT fetched when not requested.

```graphql
query GetAllBooksWithoutPerson {
  getAllBooks {
    id
    title
    author
    isCheckedOut
  }
}
```

**Expected Result:** Returns all books with their basic information. No Person data is loaded (verify with debug logs).

#### Requirement 2: Get Single Checked-Out Book With Person Details

This demonstrates retrieving a checked-out book with the person's name and contact information.

```graphql
query GetCheckedOutBookWithPerson {
  getBookForId(bookId: "2") {
    id
    title
    author
    isCheckedOut
    checkedOutBy {
      id
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
}
```

**Expected Result:** Returns book ID "2" (To Kill a Mockingbird) which is checked out by John Doe, including all contact information.

**Alternative:** Try with book ID "4" (Pride and Prejudice) checked out by Jane Smith, or book ID "7" (War and Peace) checked out by John Doe.

#### Requirement 3: Check Out and Return Books

**Check Out a Book:**

```graphql
mutation CheckOutBook {
  checkOutBook(bookId: "1", personId: "1") {
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
```

**Expected Result:** Book ID "1" (The Great Gatsby) is now checked out by Person ID "1" (John Doe). `isCheckedOut` should be `true`.

**Return a Book:**

```graphql
mutation ReturnBook {
  returnBook(bookId: "2") {
    id
    title
    author
    isCheckedOut
    checkedOutBy {
      id
    }
  }
}
```

**Expected Result:** Book ID "2" is returned. `isCheckedOut` should be `false` and `checkedOutBy` should be `null`.

**Test Error Cases:**

Try checking out a book that's already checked out:
```graphql
mutation CheckOutAlreadyCheckedOutBook {
  checkOutBook(bookId: "2", personId: "2") {
    id
    isCheckedOut
  }
}
```
**Expected Result:** Error with code `BOOK_ALREADY_CHECKED_OUT`

Try returning a book that's not checked out:
```graphql
mutation ReturnAvailableBook {
  returnBook(bookId: "1") {
    id
    isCheckedOut
  }
}
```
**Expected Result:** Error with code `BOOK_NOT_CHECKED_OUT`

**Test Input Validation:**

Try checking out a book with an empty ID:
```graphql
mutation CheckOutWithEmptyId {
  checkOutBook(bookId: "", personId: "1") {
    id
    isCheckedOut
  }
}
```
**Expected Result:** Error with code `INVALID_ID_FORMAT`

Try querying with whitespace-only ID:
```graphql
query GetBookWithWhitespaceId {
  getBookForId(bookId: "   ") {
    id
    title
  }
}
```
**Expected Result:** Error with code `INVALID_ID_FORMAT`

## Logging

By default, only info-level logs and above are shown. To see debug logs:

```bash
LOG_LEVEL=debug npm start
```

Debug logs are useful for verifying lazy loading behavior - you'll see when Person data is actually fetched.

## Future Improvements

Before production, consider:

- **Persistent storage** - Replace in-memory store with a database (PostgreSQL, MongoDB, etc.)
- **Authentication** - Add user authentication and authorization
- **Rate limiting** - Prevent abuse of the API
- **Error monitoring** - Add error tracking (Sentry, etc.)
- **API versioning** - Plan for schema evolution
- **Caching** - Add Redis or similar for frequently accessed data
- **Metrics** - Track query performance and usage patterns
