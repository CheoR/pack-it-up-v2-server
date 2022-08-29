import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    users: [User!]!
    getUser(input: UserIdInput!): User
  }

  type Mutation {
    addUser(input: UserInput!): User
    removeUser(input: UserIdInput!): DeleteResponse
    updateUser(input: UserIdInput!, update: UserUpdateInput): UpdateResponse
  }

  type User {
    _id: ID!
    username: String!
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type UpdateResponse {
    ok: Boolean!
  }

  input UserInput {
    username: String!
  }

  input UserIdInput {
    _id: ID!
  }

  input UserUpdateInput {
    username: String!
  }
`
