import mongoose from 'mongoose';

import { BLOGS_MODEL_NAME, USERS_MODEL_NAME } from './names';


export const blogsSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    url: {type: String, required: true},
    likes: {type: Number, required: true, default: 0, min: 0},
    userId: {type: mongoose.Types.ObjectId, ref: USERS_MODEL_NAME, required: true}
  },
  {
    collection: 'blogs',
    strictQuery: 'throw',
    strict: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    }
  }
);

export type TBlog = mongoose.InferSchemaType<typeof blogsSchema>;
export type TNewBlog = Omit<TBlog, 'likes'|'userId'> & Partial<Pick<TBlog, 'likes'>>;
export const Blog = mongoose.model(BLOGS_MODEL_NAME, blogsSchema);