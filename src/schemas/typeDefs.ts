export const typeDefs = `#graphql

  type Query {
    users: [User!]!
    getUser(input: UserIdInput!): User
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User
    loginUser(input: LoginUserInput!): User
    removeUser(input: UserIdInput!): DeleteResponse
    updateUser(input: UserIdInput!, update: UserUpdateInput): UpdateResponse
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    token: String!
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type UpdateResponse {
    ok: Boolean!
  }

  input UserIdInput {
    _id: ID!
  }

  input UserUpdateInput {
    username: String!
  }

  input RegisterUserInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    username: String!
  }

  input LoginUserInput {
    email: String
    password: String
  }
`
