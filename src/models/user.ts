import { model, Model, Schema } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { IUser } from '../types/user'

const UserSchema: Schema = new Schema<IUser>({
  _id: {
    type: String,
    default: uuid,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
})

export const User: Model<IUser> = model<IUser>('User', UserSchema)
