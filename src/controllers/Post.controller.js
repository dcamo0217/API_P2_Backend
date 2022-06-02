import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import PostModel from '../models/Post.model.js';

//Create post
const createPost = async (req, res, next) => {
  const { img_url, bio, author, token_data } = req.body;

  if (img_url && bio && author) {
    try {
      const post = new PostModel({
        img_url,
        bio,
        author,
        user_id: token_data.user_id,
      });
      await post.save();
      return res.status(200).json({ message: 'Post created' });
    } catch (error) {
      next(error);
    }
  }
};

//info post_id
const infoPost = async (req, res, next) => {
  const { post_id } = req.query;
  if (post_id) {
    try {
      const post = await PostModel.findById(post_id);
      if (!post) return res.status(400).json({ error: 'Post not found' });
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
};

const getPostsByAuthor = async (req, res, next) => {
  const { author } = req.query;
  if (author) {
    try {
      const posts = await PostModel.find({ author });
      if (!posts) return res.status(400).json({ error: 'Post not found' });
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
};

const getPost = async (req, res, next) => {
  const { author } = req.query;
  if (author) {
    getPostsByAuthor(req, res, next);
  } else {
    infoPost(req, res, next);
  }
};

const getTimeline = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const page = +req.body.page;

  const page_size = 10;

  if (page <= 0)
    return next({ code: 400, message: 'Page must be greater than 0' });

  try {
    const token_data = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await PostModel.find({ user_id: token_data.user_id })
      .skip((page - 1) * page_size)
      .limit(page_size);

    return res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export default { createPost, getPost, getTimeline };
