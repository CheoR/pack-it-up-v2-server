import { MongoDataSource } from 'apollo-datasource-mongodb'
import { IUser, UserError, ErrorMessages } from '../types/user'
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
        throw new Error(`dataSources error: ${error}`)
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

  async registerUser(input: IUser): Promise<IUser | UserError> {
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

  async removeUser(_id: string) {
    try {
      const resp = await this.model.deleteOne({ _id })
      // even if user does not exist
      // would not throw error because deletedCount is just 0
      if (resp.deletedCount) {
        return resp
      } else {
        throw new Error(ErrorMessages.DeleteError)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.DeleteError)
      } else {
        throw new Error(`dataSources error: ${error}`)
      }
    }
  }

  async updateUser(_id: string, update: { username: string }) {
    try {
      // TODO: improve schema for empty strings
      if (!update.username) {
        throw new Error('No Empty Strings')
      }
      const resp = await this.model.findOneAndUpdate({ _id }, update)

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.UpdateError)
      } else {
        throw new Error(`dataSources error: ${error}`)
      }
    }
  }
}
