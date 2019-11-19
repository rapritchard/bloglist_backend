const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Login token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();
    response.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request;


  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.json(updatedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id;
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Login token missing or invalid' });
    }

    const { user } = await Blog.findById(blogId);

    if (user && user.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'You do not have the permissions to complete this action' });
    }

    await Blog.findByIdAndRemove(blogId);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
