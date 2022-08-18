import { MongoDataSource } from 'apollo-datasource-mongodb'
import { Document } from 'mongoose'

interface IUser extends Document {
  _id: string
  username: string
}
export default class Users extends MongoDataSource<IUser> {
  async getUsers() {
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
    const resp = await this.model.create(input)

    return resp
  }
}
