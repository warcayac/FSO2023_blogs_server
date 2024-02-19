import Elysia from "elysia";

import * as ha from "./handlers";
import * as ho from './hooks'


const authRoutes = new Elysia({ prefix: '/login'})
  .post('/', ({body}) => ha.login(body), ho.bodyParser)
;

export default authRoutes;