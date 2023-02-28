import { model, Model, Schema } from 'mongoose'

import { IMove } from '../types/move'
import { Item } from './item'
import { Box } from './box'
import { IBox } from '../types/box'

const MoveSchema: Schema = new Schema<IMove>({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: [2, 'Name be at least 2 characters'],
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
})

MoveSchema.virtual('count', {
  ref: 'Box',
  localField: '_id',
  foreignField: 'move_id',
  count: true,
})

MoveSchema.virtual('isFragile', {
  ref: 'Box',
  localField: '_id',
  foreignField: 'move_id',
}).get(function (boxes) {
  const isFragile = boxes?.some((box: any) => box.isFragile) || false
  return isFragile
})

MoveSchema.virtual('value', {
  ref: 'Box',
  localField: '_id',
  foreignField: 'move_id',
}).get(function (boxes) {
  const value =
    boxes?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0
  return value
})

MoveSchema.virtual('boxItemsCount', {
  ref: 'Box',
  localField: '_id',
  foreignField: 'move_id',
}).get(function (boxes) {
  const count = boxes?.reduce(
    (acc: number, curr: IBox & { items: 0 }) => acc + curr.items,
    0,
  )
  return count
})

MoveSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    const docs = await Box.find({ move_id: this._id })
    await Item.deleteMany({ box_id: { $in: docs } })
    await Box.deleteMany({ move_id: this._id })
  },
)

export const Move: Model<IMove> = model<IMove>('Move', MoveSchema)
