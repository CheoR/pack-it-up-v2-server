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
    unique: true,
    minLength: [6, 'Must be at least 6 characters'],
    lowercase: true,
    trim: true,
    required: true,
    // match:
    // validate: {
    //   validator: function (v: string): boolean {
    //     return v.length < 6
    //   },
    //   message: (props) => `${props.value}
    //   is not a valid phone number!`,
    // },
  },
})

export const User: Model<IUser> = model<IUser>('User', UserSchema)
