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
    { dataSources: { movesAPI }, user_id },
  ) => {
    const resp = await movesAPI.getMovesByUserId(user_id)
    interface Move {
      _id: string
      boxItemsCount: number
      count: number
      isFragile: boolean
      value: number
    }

    const value = resp.reduce((acc: number, move: Move) => acc + move.value, 0)
    const boxCount = resp.reduce(
      (acc: number, curr: Move) => acc + curr.count,
      0,
    )
    const itemCount = resp.reduce(
      (acc: number, move: Move) => acc + move.boxItemsCount,
      0,
    )
    const isFragile = resp.some((move: Move) => move.isFragile)

    return [
      {
        _id: 'move',
        count: resp.length,
        value,
        isFragile,
        name: 'Moves',
        description: 'Contains Boxes',
      },
      {
        _id: 'box',
        count: boxCount,
        name: 'Boxes',
        description: 'Contains Items',
      },
      {
        _id: 'item',
        count: itemCount,
        name: 'Items',
        description: 'Individual Items',
      },
    ]
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
    { dataSources: { usersAPI } }, // user_id
  ) => {
    try {
      const resp = await usersAPI.getUser(_id)
      return resp
    } catch (error: unknown) {
      return new Error('Query.ts User not found')
    }
  },
}
