import { GraphQLError } from 'graphql';

/**
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
