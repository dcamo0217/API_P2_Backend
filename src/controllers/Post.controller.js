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
      return res.status(200).json({ "message": "Post created" });
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

export default { createPost, getPost };
