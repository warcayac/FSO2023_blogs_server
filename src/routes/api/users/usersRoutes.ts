import Elysia from "elysia";

import * as ha from "./handlers";
import * as ho from './hooks'


const usersRoutes = new Elysia({ prefix: '/users'})
  .get('/', ha.getAll)
  .post('/', ({body}) => ha.addOne(body), ho.bodyParser)
;

export default usersRoutes;