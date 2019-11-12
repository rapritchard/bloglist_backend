const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const middleware = require('./utils/middleware');


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(bodyParser.json());
// logs all requests to the server
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

// handler of requests with result to errors
app.use(middleware.errorHandler);

module.exports = app;
