const listHelper = require('../utils/list_helper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('dummy should return one', () => {
  const result = listHelper.dummy([]);
  expect(result).toBe(1);
});

describe('totalLikes', () => {
  test('when the list only has one blog, should return the same amount of likes', () => {
    const result = listHelper.totalLikes([blogs[0]]);
    expect(result).toBe(7);
  });

  test('when more than one blog in the list, should equal combined total of both likes', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });

  test('should return zero for empty array', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
});

describe('favoriteBlog', () => {
  test('should return blog with the highest likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });

  test('should return null when empty list of blogs', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual(null);
  });
});

describe('mostBlogs', () => {
  test('should return author with the most blogs in list of many blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });

  test('should return same author with a blog count of 1 if only one blog provided', () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1,
    });
  });

  test('should return null if blog list is empty', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toEqual(null);
  });

});

describe('mostLikes', () => {
  test('should return author with the most blogs in list of many blogs', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });

  // test('should return same author with a blog count of 1 if only one blog provided', () => {
  //   const result = listHelper.mostLikes([blogs[0]]);
  //   expect(result).toEqual({
  //     author: 'Michael Chan',
  //     likes: 7,
  //   });
  // });

  // test('should return null if blog list is empty', () => {
  //   const result = listHelper.mostLikes([]);
  //   expect(result).toEqual(null);
  // });

});
