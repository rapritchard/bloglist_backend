const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('Connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(bodyParser.json());
// logs all requests to the server
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter);
app.use('/api/blogs', blogsRouter);

// handler of requests with result to errors
app.use(middleware.errorHandler);

module.exports = app;
