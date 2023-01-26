import { compare } from 'bcryptjs'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
  REFRESH_TOKEN_SECRET,
} from '../constants/constants'

export interface IToken {
  id: Types.ObjectId
  email: string
}

export interface IUserToken {
  user_id: Types.ObjectId
  email?: string
}

export interface IUserTokenResponse {
  user_id: Types.ObjectId
  username: string
  accessToken: string
  refreshToken: string
  email?: string
}

export const setTokens = ({ id, email }: IToken): IUserTokenResponse => {
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

  return { username: '', user_id: id, accessToken, refreshToken }
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

export const comparePromise = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    compare(password, hash, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}
