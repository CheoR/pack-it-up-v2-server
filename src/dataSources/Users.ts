import { MongoDataSource } from "apollo-datasource-mongodb";
import { Document } from 'mongodb';
interface IUser extends Document {
  _id: String
  username: String
}
export default class Users extends MongoDataSource<IUser> {
  async getUsers() {
    // @ts-ignore
    const resp = await this.model.find();
    return resp;
  }

  async getUser(_id: string) {
    console.log('----- START Users.ts ---- ')
    console.log('user _id: ', _id);
    try {
      const resp = await this.findOneById(_id);
      console.log('resp');
      console.log(resp);
      console.log('----- END Users.ts ---- ')
      
      return resp;
    } catch(error: unknown) {
      return new Error("Users.ts User Not Found");
    }
  }

  async addUser(input: IUser) {
    const newUser = {
      ...input,
    }

    // @ts-ignore
    const resp = await this.model.create(newUser);

    return resp;
  }
}
