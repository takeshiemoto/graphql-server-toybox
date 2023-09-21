import { Book } from "../graphql/generated";

const books: Book[] = [
  { id: "ID1", title: "Harry Potter", author: "J.K. Rowling" },
  { id: "ID2", title: "Jurassic Park John", author: "Michael Crichton" },
  { id: "ID3", title: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: "ID4", title: "A Song of Ice and Fire", author: "George R.R. Martin" },
];

export const BookRepository = {
  getAll() {
    return books;
  },
  getById(id: string) {
    return books.find((book) => book.id === id);
  },
};
