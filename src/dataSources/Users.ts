import { MongoDataSource } from 'apollo-datasource-mongodb'
import bcrypt from 'bcryptjs'

import { SALT } from '../constants/constants'
import {
  ErrorMessages,
  IRegisterUserInput,
  IUserDocument,
  UserError,
} from '../types/user'

// TODO: move to schema
// Get field keys from User modle or move findByField to service
type PossibleFields = 'email' | 'username'
interface FindByField {
  field: PossibleFields
  input: unknown
}

export default class UsersAPI extends MongoDataSource<IUserDocument> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async getUsers() {
    // @ts-ignore - for now
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

  async findUserBy({
    field,
    input,
  }: FindByField): Promise<IUserDocument | UserError | null> {
    try {
      // @ts-ignore - for now
      const resp = await this.model.findOne({ [field]: input })

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          message: new Error(`
          dataSources/Users.ts User by email Not Found: ${error.message}`),
        }
      } else {
        throw new Error(`dataSources error: ${error}`)
      }
    }
  }

  async registerUser({
    input,
  }: IRegisterUserInput): Promise<IUserDocument | UserError> {
    const salt = await bcrypt.genSalt(parseInt(SALT, 10))
    const hashedPassword = await bcrypt.hash(input.password, salt)

    try {
      // @ts-ignore - for now
      const resp = await this.model.create({
        ...input,
        password: hashedPassword,
      })

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Could not create user: ${error.message}`)
      } else {
        throw new Error('Coult not create user - other than Error')
      }
    }
  }

  async removeUser(_id: string) {
    try {
      // @ts-ignore - for now
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
      // @ts-ignore - for now
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
