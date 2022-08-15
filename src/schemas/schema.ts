import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    users: [User!]!
  }

  type Mutation {
    # addUser(input: UserInput!): User!
    addUser(username: String!): User!
  }

  type User {
    id: ID!
    username: String!
  }

  # input UserInput {
  #   username: String!
  # }

`;
