const { v4: uuid } = require('uuid');

export const Mutation = {
  // @ts-ignore
  async addUser (parent, {input: { username }}, { dataSources: { users } }) {
    const newUser = {
      id: uuid(),
      username,
    }

    const resp = await users.addUser(newUser);

    return resp;
  },
}
