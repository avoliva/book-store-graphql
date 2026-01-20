import { Store } from '../data/store';
import { BookRecord, PersonRecord } from '../domain/models';
import { canCheckOutBook, canReturnBook } from '../domain/rules';
import {
  createBookNotFoundError,
  createPersonNotFoundError,
  createBookAlreadyCheckedOutError,
  createBookNotCheckedOutError,
} from '../domain/errors';
import * as winston from 'winston';

export class LibraryService {
  private bookStore: Store<BookRecord>;
  private personStore: Store<PersonRecord>;
  private logger: winston.Logger;

  /**
   * @param bookStore - The book store instance
   * @param personStore - The person store instance
   * @param logger - The logger instance
   */
  constructor(
    bookStore: Store<BookRecord>,
    personStore: Store<PersonRecord>,
    logger: winston.Logger
  ) {
    this.bookStore = bookStore;
    this.personStore = personStore;
    this.logger = logger;
  }

  /**
   * @param bookId - The ID of the book to check out
   * @param personId - The ID of the person checking out the book
   * @returns The updated book record
   * @throws GraphQLError if book not found, person not found, or book already checked out
   */
  checkOutBook(bookId: string, personId: string): BookRecord {
    const book = this.bookStore.get(bookId);
    if (!book) {
      throw createBookNotFoundError(bookId);
    }

    const person = this.personStore.get(personId);
    if (!person) {
      throw createPersonNotFoundError(personId);
    }

    if (!canCheckOutBook(book)) {
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
   * @param bookId - The ID of the book to return
   * @returns The updated book record
   * @throws GraphQLError if book not found or book not checked out
   */
  returnBook(bookId: string): BookRecord {
    const book = this.bookStore.get(bookId);
    if (!book) {
      throw createBookNotFoundError(bookId);
    }

    if (!canReturnBook(book)) {
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
