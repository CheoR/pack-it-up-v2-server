
export const Query = {  // @ts-ignore
  users: async (parent, args, { dataSources: { users }}) => {
    return users.getUsers();
  },
  // @ts-ignore
  getUser: async(parent, { input: { _id }}, { dataSources: { users }}) => {
    console.log('----- START Query.ts ---- ')
    console.log('_id: ', _id);
    try {
      const resp = await users.getUser(_id)
      console.log('resp');
      console.log(resp);
      console.log('----- END Query.ts ---- ')
      return resp;
    } catch(error: unknown) {
      return new Error('Query.ts User not found');
    }
  }
};
