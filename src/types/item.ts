import { Document, Types } from 'mongoose'

// TODO: check for updates
// https://github.com/GraphQLGuide/apollo-datasource-mongodb/issues/78
export interface IItem extends Document {
  box_id: Types.ObjectId
  description: string
  isFragile: boolean
  name: string
  user_id: Types.ObjectId
  value: number
}

export interface IItemInput {
  input: {
    box_id: Types.ObjectId
    count: number
    description: string
    isFragile: boolean
    name: string
    user_id: Types.ObjectId
    value: number
  }
}

export interface IItemUpdateInput {
  input: {
    _id: Types.ObjectId
    box_id: Types.ObjectId
    description: string
    isFragile: boolean
    name: string
    user_id: Types.ObjectId
    value: number
  }
}

export interface IItemIdInput {
  input: {
    _id: Types.ObjectId
  }
}

export type ItemError = {
  message: string | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'Error occurred while dealing with db',
  ServerError = 'Error occurred while dealing with db',
  CreateError = 'Could not add item',
  ReadError = 'Could not fetch item',
  UpdateError = 'Could not update item',
  DeleteError = 'Could not remove item',
}

export const isError = (
  toBeDetermined: unknown | ItemError,
): toBeDetermined is ItemError => {
  return !!(toBeDetermined as ItemError)?.message
}
