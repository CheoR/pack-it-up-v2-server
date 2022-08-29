import { IUser, UserError } from '../types/user'
import { DeleteResponse } from '../types/utils'

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
}
