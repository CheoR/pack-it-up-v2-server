import { Document, Types } from 'mongoose'

// TODO: check for updates
// https://github.com/GraphQLGuide/apollo-datasource-mongodb/issues/78
export interface IBox extends Document {
  description: string
  move_id: Types.ObjectId
  name: string
  user_id: Types.ObjectId

  // virtual
  count: number
  isFragile: boolean
  value: number
}

export interface IBoxInput {
  input: {
    count: number
    description: string
    move_id: Types.ObjectId
    name: string
    user_id: Types.ObjectId
  }
}

export interface IBoxUpdateInput {
  input: {
    _id: Types.ObjectId
    description: string
    move_id: Types.ObjectId
    name: string
    user_id: Types.ObjectId
  }
}

export interface IBoxIdInput {
  input: {
    _id: Types.ObjectId
  }
}

export type BoxError = {
  message: string | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'Error occurred while dealing with db',
  ServerError = 'Error occurred while dealing with db',
  CreateError = 'Could not add box',
  ReadError = 'Could not fetch box',
  UpdateError = 'Could not update box',
  DeleteError = 'Could not remove box',
}

export const isError = (
  toBeDetermined: unknown | BoxError,
): toBeDetermined is BoxError => {
  return !!(toBeDetermined as BoxError)?.message
}
