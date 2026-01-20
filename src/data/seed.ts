import { Store } from './store';
import { BookRecord, PersonRecord } from '../domain/models';

/**
 * Seeds the book store with initial demo data
 * @param store - The book store to seed
 * @returns Array of seeded book records
 */
export function seedBooks(store: Store<BookRecord>): BookRecord[] {
  const books: BookRecord[] = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      checkedOutById: null,
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      checkedOutById: '1',
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      checkedOutById: null,
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      checkedOutById: '2',
    },
    {
      id: '5',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      checkedOutById: null,
    },
    {
      id: '6',
      title: 'Moby Dick',
      author: 'Herman Melville',
      checkedOutById: null,
    },
    {
      id: '7',
      title: 'War and Peace',
      author: 'Leo Tolstoy',
      checkedOutById: '1',
    },
    {
      id: '8',
      title: 'The Odyssey',
      author: 'Homer',
      checkedOutById: null,
    },
  ];

  for (const book of books) {
    store.create(book);
  }

  return books;
}

/**
 * Seeds the person store with initial demo data
 * @param store - The person store to seed
 * @returns Array of seeded person records
 */
export function seedPersons(store: Store<PersonRecord>): PersonRecord[] {
  const persons: PersonRecord[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '555-0101',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane.smith@example.com',
      phoneNumber: '555-0102',
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      emailAddress: 'bob.johnson@example.com',
      phoneNumber: null,
    },
  ];

  for (const person of persons) {
    store.create(person);
  }

  return persons;
}

/**
 * Seeds both book and person stores with initial demo data
 * @param bookStore - The book store to seed
 * @param personStore - The person store to seed
 * @returns Object containing arrays of seeded books and persons
 */
export function seedData(
  bookStore: Store<BookRecord>,
  personStore: Store<PersonRecord>
): { books: BookRecord[]; persons: PersonRecord[] } {
  const books = seedBooks(bookStore);
  const persons = seedPersons(personStore);
  return { books, persons };
}
