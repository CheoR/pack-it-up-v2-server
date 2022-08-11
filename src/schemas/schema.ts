import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser(input: UserInput!): User!
  }

  type User {
    id: ID!
    username: String!
  }

  input UserInput {
    username: String!
  }

`;
