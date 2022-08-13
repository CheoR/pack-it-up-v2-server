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
    return await this.model.find();
  }

  // async getUser(id: UserId) {
  //   return await this.findOneById(id);
  // }

  // async addUser({username}: IUser) {
  //   // @ts-ignore
  //   return await this.model.create({username});
  // }
}
