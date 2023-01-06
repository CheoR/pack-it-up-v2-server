import { MongoDataSource } from 'apollo-datasource-mongodb'
import { IMove, MoveError, ErrorMessages } from '../types/move'

export default class MovesAPI extends MongoDataSource<IMove> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }
  async createMove(input: IMove): Promise<IMove | MoveError> {
    try {
      const resp = await this.model.create(input)
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
}
