import { User } from "../graphql/generated";

const users: User[] = [
  { id: "ID1", name: "John", email: "john@gmail.com" },
  { id: "ID2", name: "Paul", email: "paul@gmail.com" },
  { id: "ID3", name: "George", email: "george@gmail.com" },
  { id: "ID4", name: "Ringo", email: "ringo@gmail.com" },
];

export const UserRepository = {
  getAll() {
    return users;
  },
  getById(id: string) {
    return users.find((user) => user.id === id);
  },
};
