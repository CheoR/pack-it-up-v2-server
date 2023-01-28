export const typeDefs = `#graphql

  type Query {
    getUser(input: UserIdInput!): User
    getMove(input: MoveIdInput!): Move
    getItemsByUserId: [Item!]!
    getMovesByUserId: [Move!]!
    users: [User!]!
  }

  type Mutation {
    createBox(input: CreateBoxInput!): [Box!]
    createItem(input: CreateItemInput!): [Item!]
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
    _id: ID
    accessToken: String!
    refreshToken: String!
    user_id: ID!
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

  type Box {
    _id: ID!
    description: String
    name: String!
    move_id: String!
    user_id: String!
  }

  type Move {
    _id: ID!
    description: String
    name: String!
    user_id: String!
  }

  type Item {
    _id: ID!
    box_id: String!
    description: String
    isFragile: Boolean
    name: String!
    user_id: String!
    value: Float
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

  input CreateBoxInput {
    count: Int
    description: String
    move_id: ID!
    name: String!
  }

  input CreateMoveInput {
    count: Int
    description: String
    name: String!
  }

  input CreateItemInput {
    box_id: ID!
    count: Int
    description: String
    isFragile: Boolean
    name: String!
    value: Float
  }

  input MoveIdInput {
    _id: ID!
  }

  input UserIdInput {
    user_id: ID!
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
