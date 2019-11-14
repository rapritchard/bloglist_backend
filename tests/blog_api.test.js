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

describe('When there is initially some blogs saved', () => {
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

  test('should have the unique identifier property named id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('Addition of a new blog', () => {
  test('should succeed with valid data', async () => {
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

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const matchBlog = {
      ...newBlog,
      id: expect.anything(),
    };

    expect(blogsAtEnd[blogsAtEnd.length - 1]).toEqual(matchBlog);
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

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);


    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test('should respond with a status code of 400 if missing title', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://google.com/',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });

  test('should respond with a status code of 400 if missing url', async () => {
    const newBlog = {
      title: 'Some Cool Blog',
      author: 'John Doe',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });
});

describe('When removing a blog post resource', () => {
  test('should remove resource when provided a valid ID', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);
    expect(blogsAtEnd).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          blogToDelete,
        }),
      ]),
    );
  });
});

describe('When updating a blog post', () => {
  test('should update blog resource with provided data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
    expect(blogsAtEnd).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: blogToUpdate.id,
          ...updatedBlog,
        }),
      ]),
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
