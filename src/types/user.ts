import { Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
}

export type UserError = {
  message: string | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'error occurred while dealing with db',
  ServerError = 'error occurred while dealing with db',
}

export const isError = (
  toBeDetermined: unknown | UserError,
): toBeDetermined is UserError => {
  return !!(toBeDetermined as UserError)?.message
}
