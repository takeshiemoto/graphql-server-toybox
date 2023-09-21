import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { Resolvers } from "./graphql/generated";
import { BookRepository, UserRepository } from "./repositories";

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
