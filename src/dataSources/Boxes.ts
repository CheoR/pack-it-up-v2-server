import { MongoDataSource } from 'apollo-datasource-mongodb'
import { GraphQLError } from 'graphql'

import { DeleteResponse } from '../types/utils'
import {
  IBox,
  IBoxIdInput,
  IBoxInput,
  IBoxUpdateInput,
  BoxError,
} from '../types/box'
import { Box } from '../models/box'

export default class BoxesAPI extends MongoDataSource<IBox> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async createBox({
    input: { count, description, move_id, name, user_id },
  }: IBoxInput): Promise<IBox | IBox[] | BoxError> {
    let resp: IBox[] = []
    if (!count) count = 1

    try {
      if (count > 1) {
        const boxes = new Array(count).fill({}).map((e, i) => {
          return new Box({
            move_id,
            description: description?.toLowerCase(),
            name: `${name.toLowerCase()} ${i}`,
            user_id,
          })
        })

        resp = await this.model.insertMany(boxes)
      } else {
        const move = await this.model.create({
          move_id,
          description: description?.toLowerCase(),
          name: name.toLowerCase(),
          user_id,
        })
        resp.push(move)
      }

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not create box: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not create box: ${error.message}`)
      } else {
        throw new Error('Coult not create box - other than Error')
      }
    }
  }

  async getBoxesByUserId(user_id: string) {
    const resp = await this.model.find({ user_id }).populate([
      {
        path: 'count',
      },
      {
        path: 'isFragile',
      },
      {
        path: 'total',
      },
    ])
    return resp
  }

  async removeBox({
    input,
  }: IBoxIdInput): Promise<DeleteResponse | BoxError | null> {
    try {
      const doc = await this.model.findOne({ _id: input._id })
      await doc?.deleteOne()

      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not delete Box: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not delete Box: ${error.message}`)
      } else {
        throw new Error('Coult not delete Box - other than Error')
      }
    }
  }

  async updateBox({ input }: IBoxUpdateInput): Promise<IBox | BoxError | null> {
    const filter = { _id: input._id }
    const options = { returnOriginal: false }

    try {
      const resp = await this.model.findOneAndUpdate(filter, input, options)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not update Box: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not update Box: ${error.message}`)
      } else {
        throw new Error('Coult not update Box - other than Error')
      }
    }
  }
}
