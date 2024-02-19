import { httpResponse } from '../../../@warcayac/const-elysia';
import { TNewUser, User } from '../../../models/mongodb/usersSchema';


/* ------------------------------------------------------------------------------------------ */
export async function getAll() {
  try {
    const response = await User.find().populate({ path: 'blogs', select: '-userId' });
    return httpResponse.OK({ data: response })
  } catch (error) {
    return httpResponse.INTERNAL_ERROR();
  }
}

/* ------------------------------------------------------------------------------------------ */
export async function addOne(body: TNewUser) {
  const newUser = new User({
    name: body.name,
    username: body.username,
    passwordHash: await Bun.password.hash(
      body.password, 
      { algorithm: 'bcrypt', cost: 4 },
    ),
  });
  const response = await newUser.save();

  return httpResponse.SUCCESS(201, {data: [response]});
}
