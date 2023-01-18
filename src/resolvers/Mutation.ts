import { ApolloError } from 'apollo-server-errors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { DeleteResponse, UpdateResponse } from '../types/utils'
// import { RefreshToken } from '../models/refreshToken'
import { IMove, MoveError } from '../types/move'
import { Move } from '../models/move'
import {
  IRefreshToken,
  ISaveToken,
  RefreshTokenError,
  IRefreshTokenResp
} from '../types/refreshToken'
import {
  ErrorMessages,
  ILoginUserInput,
  IRegisterUserResponse,
  IRegisterUserInput,
  IUserDocument,
  UserError,
} from '../types/user'

export const Mutation = {
  async loginUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { email, password } }: ILoginUserInput,
    // @ts-ignore: Make type
    { dataSources },
  ): Promise<IRefreshTokenResp | UserError> {
    try {
      // TODO: Only return what you need
      const user = await dataSources.usersAPI.findUserBy({
        field: 'email',
        input: email,
      })

      if (user && (await bcrypt.compare(password, user.password))) {
        // Typecasting needed to overcome error.
        // No overload matches this call.
        const tokens = await dataSources.tokensAPI.getToken({
          field: 'user_id',
          input: user._id,
        })

        tokens.username = user.username

        return tokens
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
    {
      input: { email, firstName, lastName, password, username },
    }: IRegisterUserInput,
    // @ts-ignore: Make type
    { dataSources },
  ): Promise<IRegisterUserResponse | UserError> {
    const user = await dataSources.usersAPI.findUserBy({
      field: 'email',
      input: email,
    })

    if (user) {
      // TODO: replace error message
      // something like: could not crate user.
      // Like GraphQLError
      throw new ApolloError(
        `${ErrorMessages.CreateError} - ${email} already in use.`,
        ErrorMessages.CreateError,
      )
    }

    try {
      const resp = await dataSources.usersAPI.registerUser({
        input: {
          email: email.toLowerCase(),
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          username: username.toLowerCase(),
          password,
        },
      })

      const { accessToken, refreshToken } =
        await dataSources.tokensAPI.saveToken({
          input: {
            user_id: resp._id,
            email: resp.email,
          },
        })

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
