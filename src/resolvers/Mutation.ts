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
      console.log(
        '\t\t\n\n-------------- resolvers/Mutations.ts addUser START\n',
      )
      const resp = await users.addUser({ username })
      console.log(
        '\t\t\n\n-------------- resolvers/Mutations.ts addUser END\n',
        resp,
      )
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('\n-------------')
        console.log(
          `resolvers/Murtations.ts if error instance of error: `,
          error instanceof Error,
        )
        console.log(error)
        console.log(error.message)
        console.log('\n-------------')
        throw new Error(`
        Resolvers Mutation.ts Mutation Create Error: ${error.message}`)
        // return {
        //   message: `Resolvers Mutation.ts Mutation Create Error: ${error.message}`,
        // }
      } else {
        console.log('\n-------------')
        console.log(`error instance of error: `, error instanceof Error)
        console.log(
          `resolvers/Murtations.ts ELSE error instance of error: `,
          error instanceof Error,
        )
        console.log(typeof error)
        console.log(error)
        console.log('\n-------------')
        return {
          message:
            'Resolvers Mutation.ts Mutation addUser: something went wrong',
        }
      }
    }
  },
}
