import { t } from "elysia";

import { errorMsg } from '../../../@warcayac/const-elysia/index';


/* ------------------------------------------------------------------------------------------ */
export const bodyParser = {
  body: t.Object(
    {
      username: t.String({ minLength: 3 }),
      password: t.String({ minLength: 3 }),
    },
    {
      error: errorMsg.BODY_MALFORMATTED
    }
  ),
}
