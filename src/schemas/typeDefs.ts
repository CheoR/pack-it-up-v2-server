export const typeDefs = `#graphql

  type Query {
    getBoxesByUserId: [Box!]!
    getItemsByUserId: [Item!]!
    getHomeData: SummaryData
    getMove(input: MoveIdInput!): Move
    getMovesByUserId: [Move!]!
    getUser(input: UserIdInput!): User
    users: [User!]!
  }

  type Mutation {
    createBox(input: CreateBoxInput!): [Box!]
    createItem(input: CreateItemInput!): [Item!]
    createMove(input: CreateMoveInput!): [Move!]
    registerUser(input: RegisterUserInput!): RegisteredUserResponse
    loginUser(input: LoginUserInput!): Tokens
    removeItem(input: ItemIdInput!): DeleteResponse
    removeBox(input: BoxIdInput!): DeleteResponse
    removeMove(input: MoveIdInput!): DeleteResponse
    removeUser(input: UserIdInput!): DeleteResponse
    saveToken(input: SaveTokenInput!): UpdateResponse
    updateBox(input: BoxUpdateInput!): Box
    updateItem(input: ItemUpdateInput!): Item
    updateMove(input: MoveUpdateInput!): Move
    updateUser(input: UserUpdateInput!): User
  }

  type HomeData {
    _id: ID
    count: Int
    isFragile: Boolean
    total: Float
  }

  type SummaryData {
    data: [HomeData]
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
    # virtual
    count: Int
    isFragile: Boolean
    total: Float
  }

  type Move {
    _id: ID!
    description: String
    name: String!
    user_id: String!
    # virtual
    count: Int
    isFragile: Boolean
    total: Float
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

  input BoxIdInput {
    _id: ID!
  }

  input BoxUpdateInput {
    _id: ID!
    description: String
    name: String!
    move_id: ID!
  }

  input ItemIdInput {
    _id: ID!
  }

  input ItemUpdateInput {
    _id: ID!
    box_id: ID!
    description: String
    isFragile: Boolean
    name: String
    value: Float
  }

  input MoveIdInput {
    _id: ID!
  }

  input MoveUpdateInput {
    _id: ID!
    description: String
    name: String!
  }

  input UserIdInput {
    user_id: ID!
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
