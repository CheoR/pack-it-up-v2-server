import { Document, Types } from 'mongoose'

// TODO: Remove Document - We strongly recommend against using this approach,
// its support will be dropped in the next major version
// https://mongoosejs.com/docs/typescript.html
export interface IRefreshTokenDocument extends Document {
  createdAt: Date
  expiresAt: Date
  refreshToken: string
  user_id: Types.ObjectId
}

export interface IRefreshTokenResponse extends IRefreshTokenDocument {
  accessToken: string
  username: string
}
}

export interface ISaveTokenInput {
  input: {
    user_id: string
    email: string
  }
}

export interface ISaveToken extends IRefreshTokenDocument {
  input: {
    user_id: Types.ObjectId
    email: string
  }
}

export type RefreshTokenError = {
  message: string | Error | ErrorMessages
  resolution?: string | undefined
}

export const enum ErrorMessages {
  DBError = 'Error occurred while dealing with db',
  ServerError = 'Error occurred while dealing with db',
  CreateError = 'Could not add refresh token',
  ReadError = 'Could not fetch refresh token',
  UpdateError = 'Could not update refresh token',
  DeleteError = 'Could not remove refresh token',
}

export const isError = (
  toBeDetermined: unknown | RefreshTokenError,
): toBeDetermined is RefreshTokenError => {
  return !!(toBeDetermined as RefreshTokenError)?.message
}
