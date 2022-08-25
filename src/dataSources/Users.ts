import { MongoDataSource } from 'apollo-datasource-mongodb'
import { IUser } from '../types/user'
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
    try {
      const resp = await this.model.create(input)
      return resp
    } catch (error: unknown) {
      return new Error('Could not create user because of some reason')
    }
  }
}
