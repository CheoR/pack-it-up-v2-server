export const Mutation = {
  // @ts-ignore
  async addUser(parent, { input: { username } }, { dataSources: { users } }) {
    try {
      const resp = await users.addUser({ username })

      return resp
    } catch (error: unknown) {
      return new Error('Mutation.ts error - could not make new user ')
    }
  },
}
