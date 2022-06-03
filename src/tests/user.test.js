import 'dotenv/config';

import request from 'supertest';
import mongoose from 'mongoose';

import UserModel from '../models/User.model.js';
import PostModel from '../models/Post.model.js';

import app from '../../app.js';

describe('User Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  describe('Register', () => {
    it('Correct information return token', async () => {
      const response = await request(app).post('/users').send({
        username: 'jgimitola',
        password: 'Sa1234567&',
        email: 'reyesjd@uninorte.edu.co',
        birthdate: '01/06/2001',
        bio: 'Cule pava cole',
      });

      const { _id } = await UserModel.findOne({ username: 'jgimitola' });

      userId = _id;
      token = response.body.token;

      expect(response.statusCode).toBe(200);
      expect(token).toBeDefined();
    });

    it('Incorrect information return HTTP400', async () => {
      const response = await request(app).post('/users').send({
        username: 'jgimitola',
        password: 'Sa1234567&',
        birthdate: '01/06/2001',
        bio: 'Cule pava cole',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Login', () => {
    it('Valid Information (User does not exists)', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'jcapacho',
        password: 'Sa1234567&',
      });
      expect(response.statusCode).toBe(404);
    });

    it('Invalid Information (Wrong Password)', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'jgimitola',
        password: 'wrongPassword',
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('User Information', () => {
    it('Password and Birthday not in body', async () => {
      const response = await request(app)
        .get(`/users?user_id=${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.password).toBeUndefined();
      expect(response.body.birthdate).toBeUndefined();
    });

    it('Correct post number', async () => {
      let response = await request(app)
        .get(`/users?user_id=${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.posts_count).toBe(0);

      await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          img_url: 'http://www.baloto.com',
          bio: 'Esto es un nuevo post',
          author: 'jgimitola',
        });

      response = await request(app)
        .get(`/users?user_id=${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.posts_count).toBe(1);
    });

    it('Correct like number', async () => {
      let response = await request(app)
        .get(`/users?user_id=${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.liked_count).toBe(0);

      const { _id } = await PostModel.findOne({ author: 'jgimitola' });

      await request(app)
        .post('/posts/like')
        .set('Authorization', `Bearer ${token}`)
        .send({ post_id: _id });

      response = await request(app)
        .get(`/users?user_id=${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.liked_count).toBe(1);
    });

    it('Correct follower number', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'jgimitola',
        password: 'wrongPassword',
      });
      expect(response.statusCode).toBe(401);
    });

    it('Correct followed number', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'jgimitola',
        password: 'wrongPassword',
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
