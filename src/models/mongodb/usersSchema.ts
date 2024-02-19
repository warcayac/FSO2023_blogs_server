import mongoose from 'mongoose';

import { BLOGS_MODEL_NAME, USERS_MODEL_NAME } from './names';


export const usersSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true, minlength: 3},
    name: {type: String, required: true, minlength: 3},
    passwordHash: {type: String, required: true},
    blogs: {type: [{type:mongoose.SchemaTypes.ObjectId, ref: BLOGS_MODEL_NAME}], required: true, default: []}
  },
  {
    collection: 'users',
    strictQuery: 'throw',
    strict: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash  // don't reveal passwordHash
      },
    }
  }
);

type TPassword = { password: string };
export type TUser = mongoose.InferSchemaType<typeof usersSchema>;
export type TNewUser = Pick<TUser, 'username'|'name'> & TPassword;
export type TCredentials = Pick<TUser, 'username'> & TPassword;
export const User = mongoose.model(USERS_MODEL_NAME, usersSchema);
