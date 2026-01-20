import { BookRecord } from './models';

/**
 * Validates if a book can be checked out
 * @param book - The book to validate
 * @returns true if book is available (not checked out), false otherwise
 */
export function canCheckOutBook(book: BookRecord): boolean {
  return book.checkedOutById === null;
}

/**
 * Validates if a book can be returned
 * @param book - The book to validate
 * @returns true if book is checked out, false otherwise
 */
export function canReturnBook(book: BookRecord): boolean {
  return book.checkedOutById !== null;
}
