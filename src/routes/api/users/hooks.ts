import { t } from "elysia";

import { errorMsg } from '../../../@warcayac/const-elysia/index';


const options = {minLength: 3, error: errorMsg.PROPERTY_MISSING}

/* ------------------------------------------------------------------------------------------ */
export const bodyParser = {
  body: t.Object(
    {
      username: t.String(options),
      name: t.String(options),
      password: t.String(options),
    },
    {
      error: errorMsg.BODY_MALFORMATTED
    }
  ),
}
