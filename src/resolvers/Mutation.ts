import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { DeleteResponse, UpdateResponse } from '../types/utils'
import { ErrorMessages, ILoginUser, IUser, UserError } from '../types/user'
import { User } from '../models/user'

const SALT = 10

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
      const secret = process.env.JWT_SECRET as string
      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
        },
        secret,
        {
          expiresIn: '2 days',
        },
      )
      newUser.token = token

      const resp = await users.registerUser(newUser)

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
