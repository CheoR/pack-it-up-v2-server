export const Query = {
  // @ts-ignore: Make type
  getBoxesByUserId: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    args,
    // @ts-ignore: Make type
    { dataSources: { boxesAPI }, user_id },
  ) => {
    return boxesAPI.getBoxesByUserId(user_id)
  },
  // @ts-ignore: Make type
  getItemsByUserId: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    args,
    // @ts-ignore: Make type
    { dataSources: { itemsAPI }, user_id },
  ) => {
    return itemsAPI.getItemsByUserId(user_id)
  },
  // @ts-ignore: Make type
  getHomeData: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    args,
    // @ts-ignore: Make type
    { dataSources: { itemsAPI, boxesAPI, movesAPI }, user_id },
  ) => {
    const items = await itemsAPI.getItemsByUserId(user_id)
    const boxes = await boxesAPI.getBoxesByUserId(user_id)
    const moves = await movesAPI.getMovesByUserId(user_id)
    const total = items.reduce((acc: any, curr: any) => acc + curr.value, 0)
    const isFragile = items.some((item: any) => item.isFragile)

    return {
      data: [
        {
          id: 'move',
          count: moves.length || 0,
        },
        {
          id: 'box',
          count: boxes.length || 0,
        },
        {
          id: 'item',
          count: items.length || 0,
          total: total || 0,
          isFragile,
        },
      ],
    }
  },
  // @ts-ignore: Make type
  getMovesByUserId: async (
    // @ts-ignore: Make type
    parent,
    // @ts-ignore: Make type
    args,
    // @ts-ignore: Make type
    { dataSources: { movesAPI }, user_id },
  ) => {
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
