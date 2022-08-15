import { MongoDataSource } from "apollo-datasource-mongodb";
import { Document } from 'mongodb';
interface IUser extends Document {
  id: String
  username: String
}
export default class Users extends MongoDataSource<IUser> {
  async getUsers() {
    // @ts-ignore
    const resp = await this.model.find();
    return resp;
  }

  // async getUser(id: UserId) {
  //   return await this.findOneById(id);
  // }

  async addUser(input: IUser) {
    const newUser = {
      ...input,
    }

    // @ts-ignore
    const resp = await this.model.create(newUser);

    return resp;
  }
}
