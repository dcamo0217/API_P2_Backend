import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import users from './src/routes/users.route.js';
import unknown from './src/routes/unknown.route.js';
import error from './src/routes/error.route.js';

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'test';
const DB_USER = process.env.DB_USER || 'jdoe';
const DB_PASSWORD = process.env.DB_PASSWORD || 'dummypassword';
const MONGO_URI = process.env.MONGO_URI || 'notworking.com';
const CONN_STR = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${MONGO_URI}/${DB_NAME}`;

const app = express();
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

app.use('/users', users);

app.get('/', (req, res) => {
  res.json({ message: 'PICsHAr API' });
});

app.use(unknown);
app.use(error);

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
