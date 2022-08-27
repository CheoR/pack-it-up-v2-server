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

  async removeUser(
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { users } },
  ): Promise<IUser | UserError> {
    try {
      console.log('resolvers/Mutations.ts remove user _id', _id)
      // console.log('user: ')
      // console.log(users)
      const resp = await users.removeUser({ _id })
      console.log('resolvers/Mutations.ts resp')
      console.log(resp)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('resolvers/Mutations.ts remove user _id ERROR')
        console.log('errors')
        console.log(error.message)
        throw new Error(`resolvers/Mutations.ts error: ${error.message}`)
      } else {
        throw new Error('removeUser Unknown error')
      }
    }
  },
}
