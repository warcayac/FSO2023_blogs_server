import { faker } from "@faker-js/faker";

import { TNewBlog } from "../models/mongodb/blogsSchema";


export default function generateFakeData(): TNewBlog[] {
  return Array.from(
    { length: 10 },
    () => ({
      title: faker.lorem.words(),
      author: faker.person.fullName(),
      url: faker.internet.url(),
      likes: faker.number.int(100),
    })
  );
}
