import { model, Model, Schema } from 'mongoose'

import { IRefreshTokenDocument } from '../types/refreshToken'

const RefreshTokenSchema: Schema = new Schema<IRefreshTokenDocument>({
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    require: true,
  },
})

export const RefreshToken: Model<IRefreshTokenDocument> =
  model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema)
