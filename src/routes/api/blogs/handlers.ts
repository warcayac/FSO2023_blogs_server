import { errorMsg, httpResponse } from './../../../@warcayac/const-elysia';
import { getDecodedJwt } from '../../../@warcayac/utils-jwt';

import { Blog, TNewBlog } from '../../../models/mongodb/blogsSchema';
import generateFakeData from '../../../utils/gen_data';
import { User } from '../../../models/mongodb/usersSchema';


/* ------------------------------------------------------------------------------------------ */
export async function getAll() {
  try {
    const data = await Blog.find().populate({path: 'userId', select: '-blogs'});
    return httpResponse.OK({ data });
  } catch (error) {
    return httpResponse.INTERNAL_ERROR();
  }
}

/* ------------------------------------------------------------------------------------------ */
export async function getOne(id: string) {
  const result = await Blog.findById(id);
  
  return result !== null
    ? httpResponse.OK({data: [result]})
    : httpResponse.NOT_FOUND()
  ;
}

/* ------------------------------------------------------------------------------------------ */
export async function addOne(body: TNewBlog, headers: Headers) {
  const decodedJwt = await getDecodedJwt(headers);
  const user = decodedJwt.isOk() ? await User.findById(decodedJwt.value.id) : null;

  if (!user || decodedJwt.isErr() || (decodedJwt.isOk() && decodedJwt.value.username !== user.username)) {
    return decodedJwt.isErr() ? httpResponse.CLIENT_ERROR(401, decodedJwt.error) : null;
  }

  const newBlog = new Blog({...body, userId: user._id});
  const response = await newBlog.save();
  
  user.blogs.push(response._id);
  await user.save();

  return httpResponse.SUCCESS(201, {data: [response]});
}

/* ------------------------------------------------------------------------------------------ */
export async function addFakeData() {
  const fakeData = generateFakeData();
  const response = await Blog.insertMany(fakeData);
  
  return httpResponse.OK({data: response});
}

/* ------------------------------------------------------------------------------------------ */
export async function deleteOne(id: string, headers: Headers) {
  const decodedJwt = await getDecodedJwt(headers);
  const user = decodedJwt.isOk() ? await User.findById(decodedJwt.value.id) : null;

  if (!user || decodedJwt.isErr() || (decodedJwt.isOk() && decodedJwt.value.username !== user.username)) {
    return httpResponse.CLIENT_ERROR(
      401, 
      decodedJwt.isErr() ? decodedJwt.error : errorMsg.INVALID_TOKEN
    );
  }

  const blog = await Blog.findById(id);
  
  if (blog === null) return httpResponse.NOT_FOUND();
  if (blog.userId.toString() !== user._id.toString()) {
    return httpResponse.CLIENT_ERROR(401, errorMsg.INVALID_TOKEN);
  }

  await blog.deleteOne();
  return httpResponse.SUCCESS(204);
}

/* ------------------------------------------------------------------------------------------ */
export async function updateOneLikes(id: string, likes: number, headers: Headers) {
  const decodedJwt = await getDecodedJwt(headers);
  const user = decodedJwt.isOk() ? await User.findById(decodedJwt.value.id) : null;

  if (!user || decodedJwt.isErr() || (decodedJwt.isOk() && decodedJwt.value.username !== user.username)) {
    return httpResponse.CLIENT_ERROR(
      401, 
      decodedJwt.isErr() ? decodedJwt.error : errorMsg.INVALID_TOKEN
    );
  }

  const blog = await Blog.findById(id);
  
  if (blog === null) return httpResponse.NOT_FOUND();
  if (blog.userId.toString() !== user._id.toString()) {
    return httpResponse.CLIENT_ERROR(401, errorMsg.INVALID_TOKEN);
  }

  const response = await Blog.findByIdAndUpdate(
    id, 
    {likes}, 
    {new: true, runValidators: true}
  );

  return response !== null
    ? httpResponse.OK({data: [response]})
    : httpResponse.NOT_FOUND()
  ;
}