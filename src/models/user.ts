import { model, Model, Schema } from 'mongoose'

import { IUserDocument } from '../types/user'

const validateEmail = (email: string) => {
  // const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const UserSchema: Schema = new Schema<IUserDocument>({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  },
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: [2, 'Must be at least 2 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minLength: [2, 'Must be at least 2 characters'],
  },
  password: {
    type: String,
    required: true,
    // validate client-side since hashed emptry strings likely to meet requirements
    // minLength: [
    //   8,
    //   'Must be at least 8 characters, upper/lowercase, and contain at least one number/symbol',
    // ],
  },
  username: {
    type: String,
    unique: true,
    minLength: [6, 'Must be at least 6 characters'],
    lowercase: true,
    trim: true,
    required: true,
  },
})

export const User: Model<IUserDocument> = model<IUserDocument>(
  'User',
  UserSchema,
)
