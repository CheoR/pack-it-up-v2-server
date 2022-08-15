const { v4: uuid } = require("uuid");

export const Mutation = {
  // @ts-ignore
  // addUser: ((parent, { input }, { db }): {} => {
  //   const { username } = input;
  //   const newUser = {
  //     id: uuid(),
  //     username: username
  //   }
  //   db.users.push(newUser);
  //   return newUser;
  // }),
  addUser: ((parent, args, { dataSources: { users } }): {} => {
    console.log('Mutations.ts');
    console.log('args');
    console.table(args);
    const resp = users.addUser(args);
    console.log('resp');
    console.log(resp);
    return resp;
  }),
}
