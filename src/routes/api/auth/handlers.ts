import { httpResponse } from '../../../@warcayac/const-elysia';
import { getEncodedJwt } from '../../../@warcayac/utils-jwt';

import { TCredentials, User } from './../../../models/mongodb/usersSchema';


export async function login(body: TCredentials) {
  const user = await User.findOne({ username: body.username });
  const isValidUser = !user ? false : await Bun.password.verify(body.password, user.passwordHash);

  if (!user || !isValidUser) return httpResponse.CLIENT_ERROR(401, 'Invalid username or password');

  const encodedToken = await getEncodedJwt({ id: user._id, username: user.username });

  return httpResponse.OK({data: [{ token: encodedToken, username: user.username, name: user.name}]});
}
