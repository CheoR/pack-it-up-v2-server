import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Document } from 'mongodb'
interface IUser extends Document {
  _id: String
  username: String
}
export default class Users extends MongoDataSource<IUser> {
  async getUsers() {
    // @ts-ignore
    const resp = await this.model.find()
    return resp
  }

  async getUser(_id: string) {
    try {
      const resp = await this.findOneById(_id)

      return resp
    } catch (error: unknown) {
      return new Error('Users.ts User Not Found')
    }
  }

  async addUser(input: IUser) {
    const newUser = {
      ...input,
    }

    // @ts-ignore
    const resp = await this.model.create(newUser)

    return resp
  }
}
