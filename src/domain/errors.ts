import { GraphQLError } from 'graphql';

/**
 * Creates a GraphQLError for when a book is not found
 * @param bookId - The ID of the book that was not found
 * @returns GraphQLError with appropriate message and extensions
 */
export function createBookNotFoundError(bookId: string): GraphQLError {
  return new GraphQLError(`Book with ID ${bookId} not found`, {
    extensions: {
      code: 'BOOK_NOT_FOUND',
      bookId,
    },
  });
}

/**
 * Creates a GraphQLError for when a person is not found
 * @param personId - The ID of the person that was not found
 * @returns GraphQLError with appropriate message and extensions
 */
export function createPersonNotFoundError(personId: string): GraphQLError {
  return new GraphQLError(`Person with ID ${personId} not found`, {
    extensions: {
      code: 'PERSON_NOT_FOUND',
      personId,
    },
  });
}

/**
 * Creates a GraphQLError for when a book is already checked out
 * @param bookId - The ID of the book that is already checked out
 * @returns GraphQLError with appropriate message and extensions
 */
export function createBookAlreadyCheckedOutError(bookId: string): GraphQLError {
  return new GraphQLError(`Book with ID ${bookId} is already checked out`, {
    extensions: {
      code: 'BOOK_ALREADY_CHECKED_OUT',
      bookId,
    },
  });
}

/**
 * Creates a GraphQLError for when a book is not checked out (return attempt)
 * @param bookId - The ID of the book that is not checked out
 * @returns GraphQLError with appropriate message and extensions
 */
export function createBookNotCheckedOutError(bookId: string): GraphQLError {
  return new GraphQLError(`Book with ID ${bookId} is not checked out`, {
    extensions: {
      code: 'BOOK_NOT_CHECKED_OUT',
      bookId,
    },
  });
}

/**
 * Creates a GraphQLError for validation failures
 * @param field - The name of the field that failed validation
 * @param message - The validation error message
 * @returns GraphQLError with appropriate extensions
 */
export function createValidationError(field: string, message: string): GraphQLError {
  return new GraphQLError(`${field}: ${message}`, {
    extensions: {
      code: 'VALIDATION_ERROR',
      field,
    },
  });
}
