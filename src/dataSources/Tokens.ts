import { MongoDataSource } from 'apollo-datasource-mongodb'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'

import { setTokens } from '../auth/jwt'
import {
  ACCESS_TOKEN_DURATION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_DURATION,
  // SALT,
} from '../constants/constants'
import {
  IRefreshTokenResponse,
  ISaveToken,
  RefreshTokenError,
} from '../types/refreshToken'

type PossibleFields = 'user_id'

interface FindByField {
  field: PossibleFields
  input: unknown
}

export default class TokensAPI extends MongoDataSource<IRefreshTokenResponse> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async getToken({
    field,
    input,
  }: FindByField): Promise<IRefreshTokenResponse | RefreshTokenError | null> {
    try {
      // @ts-ignore - for now
      const resp = await this.model.findOne({ [field]: input })

      const accessToken = jwt.sign(
        {
          user_id: field,
          email: input,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_DURATION,
        },
      )

      if (resp) {
        resp.accessToken = accessToken
        return resp
      }
      return null
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          message: new Error(`
          dataSources/Tokens.ts Token by email Not Found: ${error.message}`),
        }
      } else {
        throw new Error(`dataSources error: ${error}`)
      }
    }
  }

  async saveToken({
    input,
  }: ISaveToken): Promise<IRefreshTokenResponse | RefreshTokenError> {
    // const salt = await bcrypt.genSalt(parseInt(SALT, 10))

    const { accessToken, refreshToken } = setTokens({
      id: input.user_id,
      email: input.email,
    })

    // console.log('REFRESH TOKEN BEFOR HASHING')
    // console.log(refreshToken)
    // console.log('=====')
    // const hashedRefreshToken = await bcrypt.hash(refreshToken, salt)
    const now = new Date()

    try {
      // @ts-ignore - for now
      const resp = await this.model.create({
        user_id: input.user_id,
        expiresAt: new Date(
          now.getTime() + parseInt(REFRESH_TOKEN_DURATION, 10) * 60000,
        ),
        refreshToken, // : hashedRefreshToken,
      })

      resp.accessToken = accessToken

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`server/Tokens.ts saveToken error`)
        console.log(error.message)
        throw new Error(
          `server/Tokens.ts saveToken Could not create token: ${error.message}`,
        )
      } else {
        throw new Error('Coult not create token - other than Error')
      }
    }
  }
}
