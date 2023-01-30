import { MongoDataSource } from 'apollo-datasource-mongodb'
import { GraphQLError } from 'graphql'
import { Move } from '../models/move'

import { IMove, MoveError, ErrorMessages, IMoveInput } from '../types/move'

export default class MovesAPI extends MongoDataSource<IMove> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async createMove({
    input: { name, description, count, user_id },
  }: IMoveInput): Promise<IMove | IMove[] | MoveError> {
    let resp: IMove[] = []
    if (!count) count = 1

    try {
      if (count > 1) {
        const moves = new Array(count).fill({}).map((e, i) => {
          return new Move({
            name: `${name.toLowerCase()} ${i}`,
            description: description?.toLowerCase(),
            user_id,
          })
        })

        resp = await this.model.insertMany(moves)
      } else {
        const move = await this.model.create({
          name: name.toLowerCase(),
          description: description?.toLocaleLowerCase(),
          user_id,
        })
        resp.push(move)
      }

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not create move: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not create move: ${error.message}`)
      } else {
        throw new Error('Coult not create move - other than Error')
      }
    }
  }

  async getMovesByUserId(user_id: string) {
    const resp = await this.model.find({ user_id }).populate('boxesCount')
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
