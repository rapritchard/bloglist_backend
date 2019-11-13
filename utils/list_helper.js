const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0 || blogs === undefined) return null;
  return blogs.reduce((popularBlog, blog) => ((popularBlog.likes > blog.likes) ? popularBlog : blog));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0 || blogs === undefined) return null;

  const authorBlogsTotal = _.countBy(blogs, 'author');
  const authors = _.map(authorBlogsTotal, (blogs, author) => ({ author, blogs }));
  return _.maxBy(authors, 'blogs');
};

const mostLikes = (blogs) => {
  if (blogs.length === 0 || blogs === undefined) return null;

  const authorLikes = blogs.reduce((prev, cur) => {
    if (prev.some((blog) => blog.author === cur.author)) {
      return prev.map((blog) => (blog.author === cur.author ? ({
        author: blog.author,
        likes: blog.likes + cur.likes,
      }) : blog));
    }
    return prev.concat([{
      author: cur.author,
      likes: cur.likes,
    }]);
  }, []);

  return _.maxBy(authorLikes, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
