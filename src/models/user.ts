import { model, Model, Schema } from "mongoose";
export interface IUser {
  id: string;
  username: string;
}

// looks like this schema controls what gets evaluated
// and sent to mongodb
const UserSchema: Schema = new Schema<IUser>({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  }
});

export const User: Model<IUser> = model<IUser>('User', UserSchema);
