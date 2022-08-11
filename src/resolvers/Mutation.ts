const { v4: uuid } = require("uuid");

export const Mutation = {
  // @ts-ignore
  addUser: ((parent, { input }, { db }): {} => {
    const { username } = input;
    const newUser = {
      id: uuid(),
      username: username
    }
    db.users.push(newUser);
    return newUser;
  }),
}
