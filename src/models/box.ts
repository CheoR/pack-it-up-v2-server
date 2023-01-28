import { model, Model, Schema } from 'mongoose'
import { IBox } from '../types/box'

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

export const Box: Model<IBox> = model<IBox>('Box', BoxSchema)
