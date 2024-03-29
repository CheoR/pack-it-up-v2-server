import { MongoDataSource } from 'apollo-datasource-mongodb'
import { GraphQLError } from 'graphql'

import { DeleteResponse } from '../types/utils'
import uploadImage from '../cloudinary/upload'
import { Item } from '../models/item'
import {
  IItem,
  IItemIdInput,
  IItemInput,
  IItemUpdateInput,
  ItemError,
} from '../types/item'

export default class ItemsAPI extends MongoDataSource<IItem> {
  // @ts-ignore
  constructor({ collection, cache }) {
    super(collection)
    // @ts-ignore
    super.initialize({ context: this.context, cache })
  }

  async createItem({
    input: {
      box_id,
      count,
      description,
      name,
      image_uri,
      isFragile,
      user_id,
      value,
    },
  }: IItemInput): Promise<IItem | IItem[] | ItemError> {
    let resp: IItem[] = []
    let imgUrl = ''

    if (!count) count = 1

    if (imgUrl) {
      const secure_url = await uploadImage(imgUrl, name)
      if (typeof secure_url === 'string') {
        imgUrl = secure_url
      }
    }

    try {
      if (count > 1) {
        const items = new Array(count).fill({}).map((e, i) => {
          return new Item({
            box_id,
            description: description?.toLowerCase(),
            name: `${name.toLowerCase()} ${i}`,
            image_uri: imgUrl || image_uri,
            isFragile,
            user_id,
            value,
          })
        })

        // @ts-ignore - for now
        resp = await this.model.insertMany(items)
      } else {
        // @ts-ignore - for now
        const move = await this.model.create({
          box_id,
          description: description?.toLowerCase(),
          name: name.toLowerCase(),
          image_uri,
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

  async updateItem({
    input,
  }: IItemUpdateInput): Promise<IItem | ItemError | null> {
    const filter = { _id: input._id }
    const options = { returnOriginal: false }

    if (input.image_uri) {
      const secure_url = await uploadImage(input.image_uri, input.name)
      if (typeof secure_url === 'string') {
        input.image_uri = secure_url
      }
    }

    try {
      // @ts-ignore - for now
      const resp = await this.model.findOneAndUpdate(filter, input, options)
      return resp
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not update item: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not update item: ${error.message}`)
      } else {
        throw new Error('Coult not update item - other than Error')
      }
    }
  }

  async removeItem({
    input,
  }: IItemIdInput): Promise<DeleteResponse | ItemError | null> {
    try {
      // @ts-ignore - for now
      await this.model.deleteOne({ _id: input._id })
      return { ok: true }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new GraphQLError(`Could not delete item: ${error.message}`, {
          extensions: { code: 'FORBIDDEN', http: { status: 400 } },
        })
        // throw new Error(`Could not delete item: ${error.message}`)
      } else {
        throw new Error('Coult not delete item - other than Error')
      }
    }
  }

  async getItemsByUserId(user_id: string) {
    // @ts-ignore - for now
    const resp = await this.model.find({ user_id }).exec()
    return resp
  }
}
