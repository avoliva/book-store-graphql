import { Store } from '../data/store';
import { BookRecord, PersonRecord } from '../domain/models';
import { canCheckOutBook, canReturnBook } from '../domain/rules';
import {
  createBookNotFoundError,
  createPersonNotFoundError,
  createBookAlreadyCheckedOutError,
  createBookNotCheckedOutError,
} from '../domain/errors';
import { Logger } from '../utils/logger';

/**
 * Service class encapsulating library business logic for checkout and return operations
 */
export class LibraryService {
  private bookStore: Store<BookRecord>;
  private personStore: Store<PersonRecord>;
  private logger: Logger;

  /**
   * Creates a new LibraryService instance
   * @param bookStore - The book store instance
   * @param personStore - The person store instance
   * @param logger - The logger instance
   */
  constructor(
    bookStore: Store<BookRecord>,
    personStore: Store<PersonRecord>,
    logger: Logger
  ) {
    this.bookStore = bookStore;
    this.personStore = personStore;
    this.logger = logger;
  }

  /**
   * Checks out a book to a person
   * @param bookId - The ID of the book to check out
   * @param personId - The ID of the person checking out the book
   * @returns The updated book record
   * @throws GraphQLError if book not found, person not found, or book already checked out
   */
  checkOutBook(bookId: string, personId: string): BookRecord {
    this.logger.debug(`Starting checkout: bookId=${bookId}, personId=${personId}`);

    const book = this.bookStore.get(bookId);
    if (!book) {
      throw createBookNotFoundError(bookId);
    }
    this.logger.debug(`Book found: ${book.title}`, {
      bookId,
      currentState: book.checkedOutById,
    });

    const person = this.personStore.get(personId);
    if (!person) {
      throw createPersonNotFoundError(personId);
    }
    this.logger.debug(`Person found: ${person.firstName} ${person.lastName}`, {
      personId,
    });

    if (!canCheckOutBook(book)) {
      this.logger.debug(`Checkout validation failed: book already checked out`, {
        bookId,
        checkedOutById: book.checkedOutById,
      });
      throw createBookAlreadyCheckedOutError(bookId);
    }

    const updatedBook = this.bookStore.update(bookId, {
      checkedOutById: personId,
    });

    if (!updatedBook) {
      throw createBookNotFoundError(bookId);
    }

    this.logger.info(`Book ${bookId} checked out to person ${personId}`, {
      bookId,
      personId,
      bookTitle: updatedBook.title,
    });

    return updatedBook;
  }

  /**
   * Returns a checked-out book
   * @param bookId - The ID of the book to return
   * @returns The updated book record
   * @throws GraphQLError if book not found or book not checked out
   */
  returnBook(bookId: string): BookRecord {
    this.logger.debug(`Starting return: bookId=${bookId}`);

    const book = this.bookStore.get(bookId);
    if (!book) {
      throw createBookNotFoundError(bookId);
    }
    this.logger.debug(`Book found: ${book.title}`, {
      bookId,
      currentState: book.checkedOutById,
    });

    if (!canReturnBook(book)) {
      this.logger.debug(`Return validation failed: book not checked out`, {
        bookId,
        checkedOutById: book.checkedOutById,
      });
      throw createBookNotCheckedOutError(bookId);
    }

    const updatedBook = this.bookStore.update(bookId, {
      checkedOutById: null,
    });

    if (!updatedBook) {
      throw createBookNotFoundError(bookId);
    }

    this.logger.info(`Book ${bookId} returned`, {
      bookId,
      bookTitle: updatedBook.title,
    });

    return updatedBook;
  }
}
