import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { DeleteResponse, UpdateResponse } from '../types/utils'
import { ErrorMessages, IUser, UserError } from '../types/user'
import { User } from '../models/user'

const SALT = 10

export const Mutation = {
  // @ts-ignore: Make type
  async addUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { username } },
    // @ts-ignore: Make type
    { dataSources: { users } },
  ): Promise<IUser | UserError> {
    try {
      const resp = await users.addUser({ username })
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        return {
          message:
            'Resolvers Mutation.ts Mutation addUser: something went wrong',
        }
      }
    }
  },

  async registerUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { username, email, password } },
    // @ts-ignore: Make type
    { dataSources: { users } },
  ): Promise<IUser | UserError> {
    const oldUser = await User.findOne({ email })

    if (oldUser) {
      throw new ApolloError(
        `${email} already in use.`,
        ErrorMessages.CreateError,
      )
    }

    const encrypted = await bcrypt.hash(password, SALT)
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: encrypted,
    })

    try {
      const resp = await users.registerUser(newUser)

      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
        },
        'UNSAFE_STRING',
        {
          expiresIn: '2 days',
        },
      )

      resp.token = token

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        return {
          message:
            'Resolvers Mutation.ts Mutation addUser: something went wrong',
        }
      }
    }
  },

  async removeUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { users } },
  ): Promise<DeleteResponse | UserError> {
    try {
      await users.removeUser(_id)
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
    { dataSources: { users } },
  ): Promise<UpdateResponse | UserError> {
    try {
      await users.updateUser(_id, update)
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
