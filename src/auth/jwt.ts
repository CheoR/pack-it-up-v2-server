import { compare } from 'bcryptjs'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
} from '../constants/constants'

const { sign, verify } = jwt
export interface IToken {
  id: Types.ObjectId
  email: string
}

export interface IUserToken {
  user_id: Types.ObjectId
  email?: string
}

export const setTokens = ({ id, email }: IToken) => {
  const user: IUserToken = {
    user_id: id,
  }

  const accessToken = sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_DURATION,
  })

  user.email = email

  const refreshToken = sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_DURATION,
  })

  return { id, accessToken, refreshToken }
}

export const validateAccessToken = (token: string) => {
  try {
    return verify(token, ACCESS_TOKEN_SECRET)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message !== 'jwt expired')
        console.error(`Access token error: ${error.message}`)
      throw new Error(error.message)
    } else {
      return {
        message: `JWT Access token error`,
      }
    }
  }
}
