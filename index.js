import 'dotenv/config';
import mongoose from 'mongoose';

import app from './app.js';

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'test';
const DB_USER = process.env.DB_USER || 'jdoe';
const DB_PASSWORD = process.env.DB_PASSWORD || 'dummypassword';
const MONGO_URI = process.env.MONGO_URI || 'notworking.com';
const CONN_STR = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${MONGO_URI}/${DB_NAME}`;

const main = async () => {
  console.log('###S Connecting to MongoDB...');

  try {
    await mongoose.connect(CONN_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('###S MongoDB is connected');
  } catch (error) {
    console.error('###E An error occurred connecting to MongoDB');
    process.exit(1);
  }

  console.log('###S Starting server...');

  app.listen(PORT, () => {
    console.log(`###S Server listening at port: ${PORT}`);
  });

  process.on('SIGINT', async () => {
    console.log('###S Closing connection...');
    await mongoose.disconnect();
    console.log(
      `###S Connection is closed. State is: ${mongoose.connection.readyState}`
    );
    process.exit(0);
  });
};

main();
