const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('should return blogs as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('should return all blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body.length).toBe(helper.initialBlogs.length);
});

test('Should contain a blog about react patterns in return data', async () => {
  const response = await api.get('/api/blogs');

  const contents = response.body.map((r) => r.title);
  expect(contents).toContain(
    'React patterns',
  );
});

test('should add a valid note to database', async () => {
  const newBlog = {
    title: 'Some Cool Blog',
    author: 'John Doe',
    url: 'https://google.com/',
    likes: 2,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

  const matchBlog = {
    ...newBlog,
    id: expect.anything(),
  };

  expect(blogsAtEnd[blogsAtEnd.length - 1]).toMatchObject(matchBlog);
});

test('should set likes to 0 if not provided', async () => {
  const newBlog = {
    title: 'Some Cool Blog',
    author: 'John Doe',
    url: 'https://google.com/',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);


  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
});

test('should have the unique identifier property named id', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
