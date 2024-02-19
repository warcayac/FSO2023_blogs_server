import Elysia from "elysia";

import * as ha from "./handlers";
import * as ho from './hooks'


const blogsRoutes = new Elysia({prefix: '/blogs'})
  .get('/', ha.getAll)
  .get('/:id', ({params: {id}}) => ha.getOne(id), ho.paramIdParser)
  .post('/', ({body, request: {headers}}) => ha.addOne(body, headers), ho.blogBodyParser)
  .delete(
    '/:id', 
    ({params: {id}, request: {headers}}) => ha.deleteOne(id, headers), 
    ho.idAndTokenParser,
  )
  .patch(
    '/:id', 
    ({body, params: {id}, request: {headers}}) => ha.updateOneLikes(id, body.likes, headers), 
    ho.idAndBodyParser,
  )
  // .post('/generateSample', ha.addFakeData)
;

export default blogsRoutes;
