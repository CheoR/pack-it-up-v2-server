import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    users: [User!]!
    getUser(input: UserIdInput): User
  }

  type Mutation {
    addUser(input: UserInput!): User!
  }

  type User {
    _id: ID!
    username: String!
  }

  input UserInput {
    username: String!
  }

  input UserIdInput {
    _id: ID!
  }
`
