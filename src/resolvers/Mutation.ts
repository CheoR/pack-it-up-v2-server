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

    try {
      const resp = await users.addUser(newUser);
      return resp;
    } catch (error: unknown) {
      return new Error('Mutation.ts error - could not make new user ');
    }
  },
}
