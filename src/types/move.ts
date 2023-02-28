import { Types } from 'mongoose'

export interface IMove {
  name: string
  description: string
  user_id: Types.ObjectId

  // virtual
  count: number
  isFragile: boolean
  value: number
  boxItemsCount: number
}

export interface IMoveInput {
  input: {
    name: string
    description: string
    user_id: Types.ObjectId
    count: number
  }
}

export interface IMoveUpdateInput {
  input: {
    _id: Types.ObjectId
    description: string
    name: string
    user_id: Types.ObjectId
  }
}

export interface IMoveIdInput {
  input: {
    _id: Types.ObjectId
  }
}

export type MoveError = {
  message: string | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'Error occurred while dealing with db',
  ServerError = 'Error occurred while dealing with db',
  CreateError = 'Could not add move',
  ReadError = 'Could not fetch move',
  UpdateError = 'Could not update move',
  DeleteError = 'Could not remove move',
}

export const isError = (
  toBeDetermined: unknown | MoveError,
): toBeDetermined is MoveError => {
  return !!(toBeDetermined as MoveError)?.message
}
