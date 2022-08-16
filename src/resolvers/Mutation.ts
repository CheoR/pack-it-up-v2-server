const { v4: uuid } = require('uuid');
import { Schema } from 'mongoose';

export const Mutation = {
  // @ts-ignore
  async addUser (parent, {input: { username }}, { dataSources: { users } }) {
    const newUser = {
      // _id: new Schema.Types.ObjectId(uuid()),
      _id: uuid(),
      username,
    }

    console.log('---- STATRT Mutations.ts ----');
    console.log('username: ', username);
    console.log('newUser');
    console.log(newUser);
    try {

      const resp = await users.addUser(newUser);
      console.log('---- END Mutations.ts ----');
      return resp;
    } catch (error: unknown) {
      return new Error('Mutation.ts error - could not make new user ');
    }
  },
}
