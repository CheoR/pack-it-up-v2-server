import { model, Model, Schema } from 'mongoose'
import { IItem } from '../types/item'

const ItemSchema: Schema = new Schema<IItem>({
  box_id: {
    type: Schema.Types.ObjectId,
    ref: 'Box',
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
  },
  isFragile: Boolean,
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: [2, 'Name be at least 2 characters'],
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
  value: {
    type: Number,
    min: 0,
  },
})

export const Item: Model<IItem> = model<IItem>('Item', ItemSchema)
