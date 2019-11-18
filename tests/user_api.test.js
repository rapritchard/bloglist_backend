const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');

describe('When there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', password: 'secret' });
    await user.save();
  });

  test('should fail at creating a user if username already taken with proper err msg', async () => {
    const usersAtStart = await helper.usersInDb();
    
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });

  test('should succeed at creating user with unique username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'johnnyboy79',
      name: 'John Doe',
      password: 'bourbon',
    };

    console.log(newUser);

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
