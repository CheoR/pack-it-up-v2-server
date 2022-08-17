import { model, Model, Schema } from 'mongoose'
export interface IUser {
  _id: Schema.Types.ObjectId
  username: string
}

const UserSchema: Schema = new Schema<IUser>({
  _id: {
    // type: Schema.Types.ObjectId,
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
})

export const User: Model<IUser> = model<IUser>('User', UserSchema)
