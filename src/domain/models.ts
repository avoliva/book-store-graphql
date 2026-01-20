/**
 * BookRecord represents a book in the library system
 */
export interface BookRecord {
  id: string;
  title: string;
  author: string;
  checkedOutById: string | null;
}

/**
 * PersonRecord represents a person who can check out books
 */
export interface PersonRecord {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
}
