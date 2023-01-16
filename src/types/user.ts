import { Document } from 'mongoose'

export interface IUserDocument extends Document {
  email: string
  firstName: string
  lastName: string
  password: string
  username: string
}

export interface IRegisterUserInput extends Document {
  input: {
    email: string
    firstName: string
    lastName: string
    password: string
    username: string
  }
}

export interface IRegisterUserResponse extends IUserDocument {
  accessToken: string
  refreshToken: string
}

export interface ILoginUser extends Document {
  email: string
  password: string
}

export type UserError = {
  message: string | Error | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'Error occurred while dealing with db',
  ServerError = 'Error occurred while dealing with db',
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
