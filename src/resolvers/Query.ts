export const Query = {
  // @ts-ignore
  users: async (parent, args, { dataSources: { users } }) => {
    return users.getUsers()
  },
  // @ts-ignore
  getUser: async (parent, { input: { _id } }, { dataSources: { users } }) => {
    try {
      const resp = await users.getUser(_id)
      return resp
    } catch (error: unknown) {
      return new Error('Query.ts User not found')
    }
  },
}
