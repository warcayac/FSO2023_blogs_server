import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import mongoose  from "mongoose";

import { TJMap } from '../../../../../src/@warcayac/types-common';

import { Blog } from "../../../../../src/models/mongodb/blogsSchema";
import { extractData, http } from './../../../../utils/network';
import { User } from "../../../../../src/models/mongodb/usersSchema";
import { userCredential, userList } from "../../../../utils/lists";


/*=========================================================================================================*/

let blogList : TJMap[] = await Bun.file('test/samples/blogs_sample.json').json();
const BLOGS_API_PATH = '/api/blogs';
const AUTH_API_PATH = '/api/login';
let userToken: string = '';

/*=========================================================================================================*/

describe('BLOGS test suite', () => {
  /* --------------------------------------------------------------------------------------------- */
  beforeAll(async () => {
    await User.deleteMany({});
    const users = await User.insertMany(userList);
   
    const userIds = users.map<string>(u => (u._id as mongoose.Types.ObjectId).toString());
    blogList = blogList.map(b => {
      const idx = Math.floor(Math.random() * userIds.length);
      b.userId = userIds[idx];
      return b;
    });
   
    await Blog.deleteMany({});
    await Blog.insertMany(blogList);
  });
  /* --------------------------------------------------------------------------------------------- */
  describe('AUTH blogs suite', () => {
    /* -------------------------------------------------------------------------- */
    test("should return a token when successfully logging in", async () => {
      const response = await http.post(AUTH_API_PATH, userCredential);
      expect(response.status).toBe(200);
      
      const data = await extractData(response);
      expect(data[0]!).toHaveProperty('token');
      userToken = data[0]!.token as string;
    });
    /* -------------------------------------------------------------------------- */
  });
  /* --------------------------------------------------------------------------------------------- */
  describe('GET blogs suite', () => {
    /* -------------------------------------------------------------------------- */
    test('should return a list of 10 blogs successfully', async () => {
      const response = await http.get(BLOGS_API_PATH);
      expect(response.status).toBe(200);

      const list = await extractData(response);
      expect(response.headers.get('content-type')).toBe('application/json;charset=utf-8');
      expect(list).toHaveLength(blogList.length);
      expect(Object.keys(list[0]!)).toContain('id');
      
      const {userId, ...expectedBlog} = blogList[0]!;
      expect(list.map(b => {
        const { id, userId, ...rest } = b;
        return rest;
      })
      ).toContainEqual(expectedBlog);
    });
    /* -------------------------------------------------------------------------- */
    test("should return a blog successfully by using an existing id", async () => {
      const refBlog = (await extractData<any>(await http.get(BLOGS_API_PATH)))[1]!;
      const response = await http.get(`${BLOGS_API_PATH}/${refBlog.id}`);
      expect(response.status).toBe(200);
      
      const blog = await (async () => {
        const data = await extractData(response);
        const {userId, ...other} = data[0]!;
        return other;
      })();

      const {userId, ...expectedBlog} = refBlog;
      expect(blog).toEqual(expectedBlog);
    });
    /* -------------------------------------------------------------------------- */
    test("should fail to return a blog that does not exist", async () => {
      const response = await http.get(`/23wqedas3434`);
      expect(response.status).toBe(404);
    });
  });
  /* --------------------------------------------------------------------------------------------- */
  describe('CREATE blogs suite', () => {
    /* -------------------------------------------------------------------------- */
    test('should create a new blog successfully', async () => {
      const prevCount = (await extractData(await http.get(BLOGS_API_PATH))).length;

      const newBlog = {
        "title": "Banana Moon of Love",
        "author": "Yuka Sato",
        "url": "https://monthly-parrot.biz/",
        "likes": 33
      };
      const response = await http.post(
        BLOGS_API_PATH, 
        newBlog, 
        { 'Authorization': `Bearer ${userToken}` }
      );
      expect(response.status).toBe(201);

      const list = await extractData(response);
      const {id, userId, ...rest} = list[0]!;
      expect(rest).toEqual(newBlog);

      const postCount = (await extractData(await http.get(BLOGS_API_PATH))).length;
      expect(postCount).toBe(prevCount + 1);
    });
    /* -------------------------------------------------------------------------- */
    test("should create a new blog successfully even if likes wasn't set", async () => {
      const newBlog = {
        "title": "Runway",
        "author": "헬로비너스",
        "url": "https://monthly-parrot.biz/"
      };
      const response = await http.post(
        BLOGS_API_PATH, 
        newBlog, 
        { 'Authorization': `Bearer ${userToken}` }
      );
      expect(response.status).toBe(201);

      const list = await extractData(response);
      const {likes, ...rest} = list[0]!;
      expect(likes).toEqual(0);
    });
    /* -------------------------------------------------------------------------- */
    test("shouldn't create a new blog if any required property is missing", async () => {
      const newBlog = {
        "title": "Banana Moon of Love",
        "author": "Yuka Sato",
      };
      const response = await http.post(
        BLOGS_API_PATH, 
        newBlog, 
        { 'Authorization': `Bearer ${userToken}` }
      );
      expect(response.status).toBe(400);
    });
    /* -------------------------------------------------------------------------- */
    test('should fail if no token is provided', async () => {
      const newBlog = {
        "title": "Disconnected Friendship",
        "author": "Saint Seiya OST",
        "url": "https://monthly-parrot.biz/",
        "likes": 15
      };
      const response = await http.post(
        BLOGS_API_PATH, 
        newBlog,
      );
      expect(response.status).toBe(400);
    });
  });
  /* --------------------------------------------------------------------------------------------- */
  describe('DELETE blog suite', () => {
    /* -------------------------------------------------------------------------- */
    test("should fail if no token is provided", async () => {
      const blogs = await extractData(await http.get(BLOGS_API_PATH));
      const refBlog = blogs.find(b => b.title === 'Banana Moon of Love')!;
      expect((refBlog.userId as TJMap).username).toBe(userCredential.username);

      let response = await http.delete(
        `${BLOGS_API_PATH}/${refBlog.id}`,
      );
      expect(response.status).toBe(400);
    });
    /* -------------------------------------------------------------------------- */
    test("should delete a blog successfully", async () => {
      const blogs = await extractData(await http.get(BLOGS_API_PATH));
      const refBlog = blogs.find(b => b.title === 'Banana Moon of Love')!;
      expect((refBlog.userId as TJMap).username).toBe(userCredential.username);

      let response = await http.delete(
        `${BLOGS_API_PATH}/${refBlog.id}`,
        { 'Authorization': `Bearer ${userToken}` }
      );
      expect(response.status).toBe(204);
      
      response = await http.get(`${BLOGS_API_PATH}/${refBlog.id}`);
      expect(response.status).toBe(404);
    });
  });
  /* --------------------------------------------------------------------------------------------- */
  describe('PATCH blog suite', () => {
    /* -------------------------------------------------------------------------- */
    test("should fail when updating 'likes' property if no token is provided", async () => {
      const blogs = await extractData(await http.get(BLOGS_API_PATH));
      const refBlog = blogs.find(b => b.title === 'Runway')!;
      expect((refBlog.userId as TJMap).username).toBe(userCredential.username);

      const newLikes = {
        likes: ((refBlog.likes as number) ?? 0) + 10,
      };
      refBlog.likes = newLikes.likes;
      
      const response = await http.patch(
        `${BLOGS_API_PATH}/${refBlog.id}`, 
        newLikes,
      );
      expect(response.status).toBe(400);
    });
    /* -------------------------------------------------------------------------- */
    test("should update 'likes' property of an existing blog successfully", async () => {
      const blogs = await extractData(await http.get(BLOGS_API_PATH));
      const refBlog = blogs.find(b => b.title === 'Runway')!;
      expect((refBlog.userId as TJMap).username).toBe(userCredential.username);

      const newLikes = {
        likes: ((refBlog.likes as number) ?? 0) + 10,
      };
      refBlog.likes = newLikes.likes;
      
      const response = await http.patch(
        `${BLOGS_API_PATH}/${refBlog.id}`, 
        newLikes,
        { 'Authorization': `Bearer ${userToken}` }
      );
      expect(response.status).toBe(200);

      const blog = await (async () => {
        const {userId, ...other} = (await extractData(response))[0]!;
        return other;
      })()
      const expectedBlog = await (async () => {
        const {userId, ...other} = refBlog;
        return other;
      })()
      expect(blog).toEqual(expectedBlog);
    });
    /* -------------------------------------------------------------------------- */
  });
  /* --------------------------------------------------------------------------------------------- */
  // In case Bun does not automatically terminate the test runner after all tests run
  afterAll(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
});
