export const typeDefs = `#graphql

  type Query {
    moves: [Move!]!
    users: [User!]!
    getUser(input: UserIdInput!): User
    getMove(input: MoveIdInput!): Move
  }

  type Mutation {
    createMove(input: CreateMoveInput!): Move
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

  type Move {
    _id: ID!
    name: String!
    description: String
    user_id: String!
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type UpdateResponse {
    ok: Boolean!
  }

  input CreateMoveInput {
    name: String!
    description: String
    user_id: String!
  }

  input MoveIdInput {
    _id: ID!
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
