export const Query = {
  // @ts-ignore: Make type
  getMovesByUserId: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    { input: { user_id } },
    // @ts-ignore: Make type
    { dataSources: { movesAPI } },
  ) => {

    console.log(`user_id is: ${user_id}\ninput: ${user_id}`)
    return movesAPI.getMovesByUserId(user_id)
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
    { dataSources: { usersAPI }, user_id },
  ) => {
    try {
      const resp = await usersAPI.getUser(_id)
      return resp
    } catch (error: unknown) {
      return new Error('Query.ts User not found')
    }
  },
}
