import { MongoDataSource } from 'apollo-datasource-mongodb'
import { IUser, UserError } from '../types/user'
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
      if (error instanceof Error) {
        return {
          message: new Error(`
          dataSources/Users.ts User Not Found: ${error.message}`),
        }
      } else {
        console.log('dataSources error: ', error)
      }
    }
  }

  async addUser(input: IUser): Promise<IUser | UserError> {
    try {
      const resp = await this.model.create(input)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Could not create user')
      } else {
        throw new Error('Coult not create user - other than Error')
      }
    }
  }
}
