export const typeDefs = `#graphql

  type Query {
    getUser(input: UserIdInput!): User
    getMove(input: MoveIdInput!): Move
    users: [User!]!
    movesByUserId(input: UserIdInput!): [Move!]!
  }

  type Mutation {
    createMove(input: CreateMoveInput!): [Move!]
    registerUser(input: RegisterUserInput!): RegisteredUserResponse
    loginUser(input: LoginUserInput!): Tokens
    removeMove(input: MoveIdInput!): DeleteResponse
    removeUser(input: UserIdInput!): DeleteResponse
    saveToken(input: SaveTokenInput!): UpdateResponse
    updateMove(input: MoveIdInput!, update: MoveUpdateInput): UpdateResponse
    updateUser(input: UserIdInput!, update: UserUpdateInput): UpdateResponse
  }

  type Tokens {
    _id: ID!
    accessToken: String!
    refreshToken: String!
    user_id: ID!
    username: String!
  }

  type User {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    username: String!
  }

  type RegisteredUserResponse {
    _id: ID!
    accessToken: String!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    refreshToken: String! 
    username: String!
  }

  type Move {
    _id: ID!
    description: String
    name: String!
    user_id: String!
  }

  type SaveTokHenInput {
    user_id: String!
    refreshToken: String!
  }

  input SaveTokenDataSourceInput {
    tokensAPI: String!
  }


  input SaveTokenInput {
    input: SaveTokenInput
    dataSources: SaveTokenDataSourceInput
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type UpdateResponse {
    ok: Boolean!
  }

  input CreateMoveInput {
    count: Int
    description: String
    name: String!
    user_id: String!
  }

  input MoveIdInput {
    _id: ID!
  }

  input UserIdInput {
    _id: ID!
  }

  input MoveIdInput {
    _id: ID!
  }

  input MoveUpdateInput {
    description: String
    name: String
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
    email: String!
    password: String!
  }
`
