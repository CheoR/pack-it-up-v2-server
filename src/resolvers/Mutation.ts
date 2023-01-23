import { ApolloError } from 'apollo-server-errors'
import { GraphQLError } from 'graphql'

import { DeleteResponse, UpdateResponse } from '../types/utils'
import { comparePromise, setTokens } from '../auth/jwt'
import { IMove, MoveError } from '../types/move'
import {
  IRefreshTokenResponse,
  RefreshTokenError,
  Tokens,
} from '../types/refreshToken'
import {
  ErrorMessages,
  ILoginUserInput,
  IRegisterUserResponse,
  IRegisterUserInput,
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
  ): Promise<IRefreshTokenResponse | Tokens | RefreshTokenError> {
    try {
      // TODO: Only return what you need
      const user = await dataSources.usersAPI.findUserBy({
        field: 'email',
        input: email,
      })

      if (user && (await comparePromise(password, user.password))) {
        const tokens = setTokens({
          id: user._id,
          email: user.email,
        })

        tokens.username = user.username

        return tokens
      } else {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
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
    { input, token },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ): Promise<IMove | IMove[] | MoveError> {
    try {
      const resp = await movesAPI.createMove({ input })
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
