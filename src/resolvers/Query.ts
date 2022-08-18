export const Query = {
  // @ts-ignore: Make type
  users: async (parent, args, { dataSources: { users } }) => {
    return users.getUsers()
  },
  // @ts-ignore: Make type
  getUser: async (parent, { input: { _id } }, { dataSources: { users } }) => {
    try {
      const resp = await users.getUser(_id)
      return resp
    } catch (error: unknown) {
      return new Error('Query.ts User not found')
    }
  },
}
