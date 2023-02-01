import { model, Model, Schema } from 'mongoose'

import { IMove } from '../types/move'

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

MoveSchema.virtual('total', {
  ref: 'Box',
  localField: '_id',
  foreignField: 'move_id',
}).get(function (boxes) {
  const total =
    boxes?.reduce((acc: number, curr: any) => acc + curr.total, 0) || 0
  return total
})

export const Move: Model<IMove> = model<IMove>('Move', MoveSchema)
