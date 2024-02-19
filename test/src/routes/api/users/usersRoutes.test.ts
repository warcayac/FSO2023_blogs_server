import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import mongoose from "mongoose";

import { User } from './../../../../../src/models/mongodb/usersSchema';
import { extractData, http } from './../../../../utils/network';
import { userList } from './../../../../utils/lists';


/*=========================================================================================================*/

const API_PATH = '/api/users';

/*=========================================================================================================*/

describe('USER test suite', () => {
  /* ********************************************************************************************* */
  beforeAll(async () => {
    await User.deleteMany({});
    await User.insertMany(userList);
  });
  /* ********************************************************************************************* */
  describe('GET request', () => {
    /* -------------------------------------------------------------------------- */
    test('should return a list of 2 users successfully', async () => {
      const response = await http.get(API_PATH);
      expect(response.status).toBe(200);

      const list = await extractData(response);
      expect(response.headers.get('content-type')).toBe('application/json;charset=utf-8');
      expect(list).toHaveLength(userList.length);
      expect(Object.keys(list[0]!)).toContain('id');

      const {passwordHash, ...user} = userList[0]!;
      expect(list.map(b => {
        const { id, blogs, ...rest } = b;
        return rest;
      })
      ).toContainEqual(user);
    });
    /* -------------------------------------------------------------------------- */
  });
  /* ********************************************************************************************* */
  describe('POST request', () => {
    /* -------------------------------------------------------------------------- */
    test("should create a new user successfully", async () => {
      const newUser = {
        username: "johndoe",
        name: "John Doe",
        password: "123456",
      };
      const response = await http.post(API_PATH, newUser);
      expect(response.status).toBe(201);
    });
    /* -------------------------------------------------------------------------- */
    test('should fail if a property is missing', async () => {
      const newUser = {
        username: "johndoe",
        name: "John Doe",
      };
      const response = await http.post(API_PATH, newUser);
      expect(response.status).toBe(400);
    })
    
    /* -------------------------------------------------------------------------- */
  });
  /* ********************************************************************************************* */
  // In case Bun does not automatically terminate the test runner after all tests run
  afterAll(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
});