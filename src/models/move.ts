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
    minLength: [2, 'Description be at least 2 characters'],
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
})

export const Move: Model<IMove> = model<IMove>('Move', MoveSchema)
