require('dotenv').config();

let { PORT } = process.env;
let { MONGODB_URI } = process.env;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.MONGODB_TEST_URI;
}

module.exports = {
  PORT,
  MONGODB_URI,
};
