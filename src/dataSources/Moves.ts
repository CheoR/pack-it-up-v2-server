import { MongoDataSource } from 'apollo-datasource-mongodb'
import { IMove, MoveError, ErrorMessages } from '../types/move'

export default class MovesAPI extends MongoDataSource<IMove> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async createMove(input: IMove[]): Promise<IMove | IMove[] | MoveError> {
    console.log('server/moves.ts createMove')
    console.log(input)
    console.log('--------------\n\n')
    try {
      const resp = await this.model.create(input)
      console.log('Moves resp')
      console.log(resp)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Could not create move')
      } else {
        throw new Error('Coult not create move - other than Error')
      }
    }
  }

  async getMovesByUserId(id: string) {
    const resp = await this.model.find({ user_id: id }).exec()
    return resp
  }

  async removeMove(_id: string) {
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

  async updateMove(
    _id: string,
    update: {
      description?: string
      name?: string
    },
  ) {
    try {
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
