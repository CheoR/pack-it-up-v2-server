import { Document, Types } from 'mongoose'

export interface IMove extends Document {
  name: string
  description: string
  user_id: Types.ObjectId

  // virtual
  count: number
  isFragile: boolean
  total: number
}

export interface IMoveInput {
  input: {
    name: string
    description: string
    user_id: Types.ObjectId
    count: number
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
