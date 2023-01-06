export const Query = {
  // @ts-ignore: Make type
  movesByUserId: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ) => {
    return movesAPI.getMovesByUserId(_id)
  },
  // @ts-ignore: Make type
  users: async (parent, args, { dataSources: { usersAPI } }) => {
    return usersAPI.getUsers()
  },
  // @ts-ignore: Make type
  getUser: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { _id } },
    // @ts-ignore: Make type
    { dataSources: { usersAPI } },
  ) => {
    try {
      const resp = await usersAPI.getUser(_id)
      return resp
    } catch (error: unknown) {
      return new Error('Query.ts User not found')
    }
  },
}
