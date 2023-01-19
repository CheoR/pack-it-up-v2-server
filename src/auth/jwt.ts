import { compare } from 'bcryptjs'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
  SALT,
} from '../constants/constants'

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

  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_DURATION,
  })

  user.email = email

  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_DURATION,
  })

  return { id, accessToken, refreshToken }
}

export const validateAccessToken = async (token: string) => {
  try {
    return await jwt.verify(token, ACCESS_TOKEN_SECRET)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message !== 'jwt expired') {
        console.error(`Access token error: ${error.message}`)
        // return null
      }
      // throw new Error(error.message)
    } else {
      return {
        message: `JWT Access token error`,
      }
    }
  }
}

export const validateRefreshToken = async (token: string) => {
  // const salt = await bcrypt.genSalt(parseInt(SALT, 10))
  // const refreshToken = await bcrypt.hash(token, salt)
  try {
    return await jwt.verify(token, REFRESH_TOKEN_SECRET)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message !== 'jwt expired')
        console.error(`Refresh token error: ${error.message}`)
      // throw new Error(error.message)
      return null
    } else {
      return {
        message: `JWT Access token error`,
      }
    }
  }
}
