import { BookRecord } from './models';

export function canCheckOutBook(book: BookRecord): boolean {
  return book.checkedOutById === null;
}

export function canReturnBook(book: BookRecord): boolean {
  return book.checkedOutById !== null;
}
