import { Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
  token: string
}

export type UserError = {
  message: string | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'error occurred while dealing with db',
  ServerError = 'error occurred while dealing with db',
  CreateError = 'Could not add user',
  ReadError = 'Could not fetch user',
  UpdateError = 'Could not update user',
  DeleteError = 'Could not remove user',
}

export const isError = (
  toBeDetermined: unknown | UserError,
): toBeDetermined is UserError => {
  return !!(toBeDetermined as UserError)?.message
}
