import { TJMap } from './../../src/@warcayac/types-common';


let jsonList : TJMap[] = await Bun.file('test/samples/users_sample.json').json();
export const userCredential = {
  username: jsonList[0]!.username as string,
  password: jsonList[0]!.password as string,
}

export const userList : TJMap[] = await Promise.all(jsonList.map( async (m) => {
  const { password, ...rest } = m;
  const jmap = { 
    ...rest, 
    passwordHash: await Bun.password.hash(password as string, { algorithm: 'bcrypt', cost: 4 }) ,
  }
  return jmap;
}));


