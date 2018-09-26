process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const keys = require('../../config/keys');

const dbConnect = async () => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(keys.mongoURI, {});
}

const dbDisconnect = async () => {
  await mongoose.disconnect();
}

module.exports = { dbConnect, dbDisconnect };
