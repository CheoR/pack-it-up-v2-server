import { ApolloError } from 'apollo-server-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { DeleteResponse, UpdateResponse } from '../types/utils'
import { ErrorMessages, ILoginUser, IUser, UserError } from '../types/user'
import { User } from '../models/user'


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
    { input: { email, firstName, lastName, password, username } },
    // @ts-ignore: Make type
    { dataSources: { usersAPI } },
  ): Promise<IUser | UserError> {
    const oldUser = await User.findOne({ email })

    if (oldUser) {
      // TODO: replace error message
      // something like: could not crate user.
      throw new ApolloError(
        `${ErrorMessages.CreateError} - ${email} already in use.`,
        ErrorMessages.CreateError,
      )
    }

    const SALT = process.env.SALT as unknown as string
    const encrypted = await bcrypt.hash(password, parseInt(SALT, 10))
    const newUser = new User({
      email: email.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      username: username.toLowerCase(),
      password: encrypted,
    })

    try {
      const secret = process.env.JWT_SECRET as string
      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
          firstName,
          lastName,
          username,
        },
        secret,
        {
          expiresIn: '2 days',
        },
      )
      newUser.token = token

      const resp = await usersAPI.registerUser(newUser)

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
}
