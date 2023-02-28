import { MongoDataSource } from 'apollo-datasource-mongodb'
import { GraphQLError } from 'graphql'
import { Move } from '../models/move'

import { DeleteResponse } from '../types/utils'
import {
  IMove,
  MoveError,
  IMoveInput,
  IMoveIdInput,
  IMoveUpdateInput,
} from '../types/move'

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

        // @ts-ignore - for now
        resp = await this.model.insertMany(moves)
      } else {
        // @ts-ignore - for now
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
    // @ts-ignore - for now
    const resp = await this.model.find({ user_id }).populate([
      {
        path: 'count',
      },
      {
        path: 'isFragile',
        populate: { path: 'isFragile' },
      },
      {
        path: 'value',
        populate: { path: 'value' },
      },
      {
        path: 'boxItemsCount',
        populate: { path: 'items' },
      },
    ])

    return resp
  }

  async removeMove({
    input,
  }: IMoveIdInput): Promise<DeleteResponse | MoveError | null> {
    try {
      // @ts-ignore - for now
      const doc = await this.model.findOne({ _id: input._id })
      await doc?.deleteOne()

      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not delete Move: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not delete Move: ${error.message}`)
      } else {
        throw new Error('Coult not delete Move - other than Error')
      }
    }
  }

  async updateMove({
    input,
  }: IMoveUpdateInput): Promise<IMove | MoveError | null> {
    const filter = { _id: input._id }
    const options = { returnOriginal: false }

    try {
      // @ts-ignore - for now
      const resp = await this.model.findOneAndUpdate(filter, input, options)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not update Move: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not update Move: ${error.message}`)
      } else {
        throw new Error('Coult not update Move - other than Error')
      }
    }
  }
}
