import { model, Document, Model, Schema } from "mongoose";

export interface IUser { // extends Document {
  username: string;
}

const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  }
});

export const User: Model<IUser> = model<IUser>('User', UserSchema);


// type UserType = IUser & Document;

// export const UserSchema = new Schema<IUser, Model<UserType>>({
//   username: {
//     type: String,
//     required: true,
//   },
// });

// export const User = model<IUser>("User", UserSchema);
// export const User = model<UserType>("User", UserSchema);
