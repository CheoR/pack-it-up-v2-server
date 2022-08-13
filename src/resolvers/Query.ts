export const Query = {
  // @ts-ignore
  users: async (parent, args, { dataSources: { users }}) => {
    return users.getUsers();
  }
};
