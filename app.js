import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import users from './src/routes/users.route.js';
import posts from './src/routes/post.route.js';
import unknown from './src/routes/unknown.route.js';
import follow from './src/routes/follow.route.js';
import error from './src/routes/error.route.js';

const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

app.use('/users', users);
app.use('/posts', posts);
app.use('/follows', follow);
app.get('/', (req, res) => {
  res.json({ message: 'PICsHAr API' });
});

app.use(unknown);
app.use(error);

export default app;
