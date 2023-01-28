import { MongoDataSource } from 'apollo-datasource-mongodb'
import { GraphQLError } from 'graphql'

import { IItem, IItemInput, ItemError } from '../types/item'
import { Item } from '../models/item'

export default class ItemsAPI extends MongoDataSource<IItem> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async createItem({
    input: { box_id, count, description, name, isFragile, user_id, value },
  }: IItemInput): Promise<IItem | IItem[] | ItemError> {
    console.log('i am ehre')

    let resp: IItem[] = []
    if (!count) count = 1

    try {
      if (count > 1) {
        const items = new Array(count).fill({}).map((e, i) => {
          return new Item({
            box_id,
            description: description?.toLowerCase(),
            name: `${name.toLowerCase()} ${i}`,
            isFragile,
            user_id,
            value,
          })
        })

        resp = await this.model.insertMany(items)
      } else {
        const move = await this.model.create({
          box_id,
          description: description?.toLowerCase(),
          name: name.toLowerCase(),
          isFragile,
          user_id,
          value,
        })
        resp.push(move)
      }

      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not create item: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not create item: ${error.message}`)
      } else {
        throw new Error('Coult not create item - other than Error')
      }
    }
  }

  async getItemsByUserId(user_id: string) {
    const resp = await this.model.find({ user_id }).exec()
    return resp
  }
}
