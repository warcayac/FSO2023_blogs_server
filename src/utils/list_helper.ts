import { TBlog } from '../models/mongodb/blogsSchema';


export function dummy(blogs: TBlog[]): number {
  return 1
}


export function totalLikes(blogs: TBlog[]): number {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


export function favoriteBlog(blogs: TBlog[]): TBlog | undefined {
  return blogs.length === 0
    ? undefined
    : blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}


type TAuthors = Record<string, number>;

export function mostBlogs(blogs: TBlog[]): { author: string, blogs: number } | undefined {
  if (blogs.length === 0) return undefined;

  let authors : TAuthors = {}
  blogs.forEach(b => authors[b.author] = (authors[b.author] || 0) + 1);

  const maxBlogs = Math.max(...Object.values(authors));
  const result = Object.entries(authors)
    .filter(([_, blogs]) => blogs === maxBlogs)
    .map(([author, blogs]) => ({ author, blogs }))
  ;

  return result[0];
}

export function mostLikes(blogs: TBlog[]): { author: string, likes: number } | undefined {
  if (blogs.length === 0) return undefined;

  let authors : TAuthors = {}
  blogs.forEach(b => authors[b.author] = (authors[b.author] || 0) + b.likes);

  const maxLikes = Math.max(...Object.values(authors));
  const result = Object.entries(authors)
    .filter(([_, likes]) => likes === maxLikes)
    .map(([author, likes]) => ({ author, likes }))
  ;

  return result[0];
}

