import { model, Model, Schema } from 'mongoose'
import { IItem } from '../types/item'
import { IBox } from '../types/box'
import { Item } from './item'

const BoxSchema: Schema = new Schema<IBox>({
  description: {
    type: String,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: [2, 'Name be at least 2 characters'],
  },
  move_id: {
    type: Schema.Types.ObjectId,
    ref: 'Move',
    trim: true,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
})

BoxSchema.virtual('count', {
  ref: 'Item', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'box_id', // is equal to `foreignField`
  count: true, // And only get the number of docs
})

BoxSchema.virtual('isFragile', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'box_id',
}).get(function (items) {
  const isFragile = items?.some((item: IItem) => item.isFragile) || false
  return isFragile
})

BoxSchema.virtual('total', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'box_id',
}).get(function (items) {
  const total =
    items?.reduce((acc: number, curr: IItem) => acc + curr.value, 0) || 0
  return total
})

BoxSchema.pre('deleteOne', { document: true, query: false }, async function () {
  // this instanceof mongoose.Query; // true
  // In deleteOne() and deleteMany() middleware, this is the
  // Mongoose Query object, not the document(s) being deleted.
  await Item.deleteMany({ box_id: this._id })
})

export const Box: Model<IBox> = model<IBox>('Box', BoxSchema)
