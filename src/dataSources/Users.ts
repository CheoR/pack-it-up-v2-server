import { MongoDataSource } from "apollo-datasource-mongodb";
import { Document, ObjectId } from 'mongodb';

// interface UserDocument {
//   _id: ObjectId
//   username: string
// }

// type MongoObjectId = ObjectId;
// type UUID = string;
// type UserId = MongoObjectId | UUID;
// interface IUser extends Document {
//   username: String
// }
interface IUser extends Document {
  username: String
}

export default class Users extends MongoDataSource<IUser> {
  async getUsers() {
    // @ts-ignore
    const resp = await this.model.find();
    console.log('fetching all users');
    return resp;
  }

  // async getUser(id: UserId) {
  //   return await this.findOneById(id);
  // }

  async addUser({input}: IUser) {
    // @ts-ignore
    const resp = await this.model.create({input});
    console.log('input: ', input);
    console.log('Users.ts');
    // console.log(resp);
    return resp; /// await this.model.create({input});
  }
}
