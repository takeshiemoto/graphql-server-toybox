import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { Resolvers, User, Book } from "./graphql/generated";

const users: User[] = [
  { id: "ID1", name: "John", email: "john@gmail.com" },
  { id: "ID2", name: "Paul", email: "paul@gmail.com" },
  { id: "ID3", name: "George", email: "george@gmail.com" },
  { id: "ID4", name: "Ringo", email: "ringo@gmail.com" },
];

const books: Book[] = [
  { id: "ID1", title: "Harry Potter", author: "J.K. Rowling" },
  { id: "ID2", title: "Jurassic Park John", author: "Michael Crichton" },
  { id: "ID3", title: "The Hobbit", author: "J.R.R. Tolkien" },
  { id: "ID4", title: "A Song of Ice and Fire", author: "George R.R. Martin" },
];

const UserRepository = {
  getAll() {
    return users;
  },
  getById(id: string) {
    return users.find((user) => user.id === id);
  },
};

const BookRepository = {
  getAll() {
    return books;
  },
  getById(id: string) {
    return books.find((book) => book.id === id);
  },
};

const typeDefs = gql`
  interface Account {
    id: ID!
    name: String!
  }

  type GuestAccount implements Account {
    id: ID!
    name: String!
    expiresAt: String!
  }

  type AdminAccount implements Account {
    id: ID!
    name: String!
    email: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
  }

  union SearchResult = User | Book

  type Query {
    getUsers(id: ID): [User!]!
    search(text: String!): [SearchResult!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    getUsers: (_, args) => {
      if (args.id) {
        const user = UserRepository.getById(args.id);
        if (!user) {
          throw new Error(`User with id ${args.id} not found`);
        }
        return [user];
      }

      return UserRepository.getAll();
    },
    search: (_, args) => {
      const users = UserRepository.getAll().filter((user) => {
        return user.name.toLowerCase().includes(args.text.toLowerCase());
      });

      const books = BookRepository.getAll().filter((book) => {
        return book.title.toLowerCase().includes(args.text.toLowerCase());
      });

      return [...users, ...books];
    },
  },
  SearchResult: {
    __resolveType(obj) {
      if ("name" in obj) {
        return "User";
      }

      if ("title" in obj) {
        return "Book";
      }
      return null;
    },
  },
};

const main = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  const app = express();

  server.applyMiddleware({ app });

  const PORT = 4200;
  app.listen({ port: PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
};

main();
