import { IUser, UserError } from '../types/user'

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
}
