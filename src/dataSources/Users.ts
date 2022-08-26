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
        console.log(
          `dataources/Users.ts IF error instance of error: `,
          error instanceof Error,
        )
        console.log('\n-------------')
        console.log(error)
        console.log(error.message)
        console.log('\n-------------')
        // return {
        //   message: `if dataSources/Users.ts Create Error: ${error.message}`,
        // }
        throw new Error('moo cow')
      } else {
        console.log(
          `dataources/Users.ts ELSE error instance of error: `,
          error instanceof Error,
        )
        console.log(error)
        console.log('typeof error: ', typeof error)
        return {
          message:
            'dataources/Users.ts else dataSources/Users.ts addUser: something went wrong',
        }
      }
    }
  }
}
