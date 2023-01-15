import { ApolloError } from 'apollo-server-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { IRefreshToken, RefreshTokenError } from '../types/refreshToken'
import { DeleteResponse, UpdateResponse } from '../types/utils'
import { RefreshToken } from '../models/refreshToken'
import { IMove, MoveError } from '../types/move'
import { setTokens } from '../auth/jwt'
import { User } from '../models/user'
import { Move } from '../models/move'
import {
  ErrorMessages,
  ILoginUser,
  IRegisterUser,
  UserError,
} from '../types/user'

export const Mutation = {
  async loginUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { email, password } },
  ): Promise<ILoginUser | UserError> {
    try {
      const user = await User.findOne({ email })

      if (user && (await bcrypt.compare(password, user.password))) {
        // Typecasting needed to overcome error.
        // No overload matches this call.
        const secret = process.env.JWT_SECRET as string
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
          },
          secret,
          {
            expiresIn: '2 days',
          },
        )

        user.token = token

        return user
      } else {
        throw new ApolloError(
          'Email/Password do not match',
          ErrorMessages.ReadError,
        )
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        return {
          message:
            'Resolvers Mutation.ts Mutation loginUser: something went wrong',
        }
      }
    }
  },

  async createMove(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { name, description, user_id, count }, token },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ): Promise<IMove | IMove[] | MoveError> {
    console.log('server Mutations createMOve')
    console.log(name, description, user_id)
    console.log(`createing ${count} moves`)
    console.log(`token: ${token}`)
    console.log('---------\n\n')

    // const newMove = new Move({
    //   name: name.toLowerCase(),
    //   description: description?.toLowerCase(),
    //   user_id,
    // })
    const moves = new Array(count).fill({}).map((e, i) => {
      return new Move({
        name: `${name.toLowerCase()} ${i}`,
        description: description?.toLowerCase(),
        user_id,
      })
    })
    console.log('moves')
    console.log(moves)
    // const moves = new Move({
    //   name: name.toLowerCase(),
    //   description: description?.toLowerCase(),
    //   user_id,
    // })

    try {
      const resp = await movesAPI.createMove(moves) // movesAPI.createMove(newMove)
      console.log('moves resp')
      console.log(resp)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Mutation.ts Mutations createmove: ${error.message}`)
        console.log(error.stack)
        throw new Error(error.message)
      } else {
        return {
          message:
            'Resolvers Mutation.ts Mutation createMove: something went wrong',
        }
      }
    }
  },

  async registerUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { email, firstName, lastName, password, username } },
    // @ts-ignore: Make type
    { dataSources },
  ): Promise<IRegisterUser | UserError> {
    const oldUser = await User.findOne({ email })

    if (oldUser) {
      // TODO: replace error message
      // something like: could not crate user.
      // Like GraphQLError
      throw new ApolloError(
        `${ErrorMessages.CreateError} - ${email} already in use.`,
        ErrorMessages.CreateError,
      )
    }

    const SALT = process.env.SALT as unknown as string
    const salt = await bcrypt.genSalt(parseInt(SALT, 10))
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      email: email.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    })

    try {
      const { accessToken, refreshToken } = setTokens({
        id: newUser.id,
        email: newUser.email,
      })

      const resp = await dataSources.usersAPI.registerUser(newUser)
      await this.saveToken(
        {
          input: {
            user_id: newUser._id,
            refreshToken: refreshToken,
          },
        },
        {
          dataSources: {
            tokensAPI: dataSources.tokensAPI,
          },
        },
      )

      resp.accessToken = accessToken
      resp.refreshToken = refreshToken

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        return {
          message:
            'Resolvers Mutation.ts Mutation registerUser: something went wrong',
        }
      }
    }
  },

  async removeMove(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ): Promise<DeleteResponse | MoveError> {
    try {
      await movesAPI.removeMove(_id)
      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error
      } else {
        throw new Error(`Mutation error: ${error}`)
      }
    }
  },

  async removeUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { usersAPI } },
  ): Promise<DeleteResponse | UserError> {
    try {
      await usersAPI.removeUser(_id)
      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error
      } else {
        throw new Error(`Mutation error: ${error}`)
      }
    }
  },

  async updateUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id }, update },
    // @ts-ignore: Make type
    { dataSources: { usersAPI } },
  ): Promise<UpdateResponse | UserError> {
    try {
      await usersAPI.updateUser(_id, update)
      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error
      } else {
        throw new Error(`Mutation error: ${error}`)
      }
    }
  },
  async updateMove(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id }, update },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ): Promise<UpdateResponse | MoveError> {
    try {
      await movesAPI.updateMove(_id, update)
      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error
      } else {
        throw new Error(`Mutation error: ${error}`)
      }
    }
  },
}
