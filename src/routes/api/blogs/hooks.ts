import { t } from "elysia"

import { errorMsg, parsers } from "../../../@warcayac/const-elysia"


/* ------------------------------------------------------------------------------------------ */
export const paramIdParser = parsers.paramObjectId

/* ------------------------------------------------------------------------------------------ */
export const idAndTokenParser = {
  ...parsers.paramObjectId,
  ...parsers.headerBearerAuth,
}

/* ------------------------------------------------------------------------------------------ */
export const blogBodyParser = {
  body: t.Object(
    {
      title: t.String({minLength: 3}),
      author: t.String({minLength: 3}),
      url: t.String({minLength: 3}),
      likes: t.Optional(t.Number()),
    },
    {
      error: errorMsg.BODY_MALFORMATTED
    }
  ),
  ...parsers.headerBearerAuth,
}

/* ------------------------------------------------------------------------------------------ */
export const idAndBodyParser = {
  ...parsers.paramObjectId,
  body: t.Object(
    {
      likes: t.Number({minimum: 0}),
    },
    {
      error: errorMsg.BODY_MALFORMATTED
    }
  ),
  ...parsers.headerBearerAuth,
}
