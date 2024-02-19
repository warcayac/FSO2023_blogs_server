import Elysia from "elysia";
import cors from "@elysiajs/cors";
import mongoose from "mongoose";

import { httpResponse } from "./@warcayac/const-elysia";
import wlogger from "./@warcayac/wlogger";
import errorHandler from "./@warcayac/middleware/errorHandler";
import {doConnection} from "./@warcayac/utils-mongodb";

import blogsRoutes from "./routes/api/blogs/blogsRoutes";
import usersRoutes from "./routes/api/users/usersRoutes";
import authRoutes from "./routes/api/auth/authRoutes";


await doConnection();
await mongoose.connect(process.env.MONGODB_URI!);

export const app = new Elysia();

app
  .use(cors({methods: '*'}))
  .use(wlogger(true, process.env.NODE_ENV !== 'test'))
  .use(errorHandler())
  .group('/api', app => app
    .use(blogsRoutes)
    .use(usersRoutes)
    .use(authRoutes)
  )
  .get('/', () => "Hello Elysia")
  .all('*', () => httpResponse[404]('Path name not found'))
  .listen(
    process.env.PORT || 3003,
    () => console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
  )
;
