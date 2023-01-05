import { model, Model, Schema } from 'mongoose'
import { v4 as uuid } from 'uuid'

import { IMove } from '../types/move'

const MoveSchema: Schema = new Schema<IMove>({
  _id: {
    type: String,
    default: uuid,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
    minLength: [2, 'Must be at least 2 characters'],
  },
  user_id: {
    type: String,
    trim: true,
    require: true,
  },
})

export const Move: Model<IMove> = model<IMove>('Move', MoveSchema)
