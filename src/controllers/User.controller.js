import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.model.js';
import Follow from '../models/Follow.model.js';
import Post from '../models/Post.model.js';
import ActivityRegister from '../models/ActivityRegister.model.js';

const salt = process.env.SALT;

const login = async (req, res, next) => {
  const { token } = req.body;

  if (token) {
    loginWithToken(req, res, next);
  } else {
    loginWithCredentials(req, res, next);
  }
};

const loginWithToken = async (req, res, next) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const mongooseUser = await UserModel.findById(decoded.user_id);

      if (!mongooseUser) return next({ code: 404 });

      return res.status(200).json({});
    } catch (error) {
      next({ code: 401 });
    }
  }
};

const loginWithCredentials = async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const user = await UserModel.findOne({ username });

      if (!user) return next({ code: 404, message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ token });
      } else {
        return next({ code: 401, message: 'User or password incorrect' });
      }
    } catch (error) {
      next(error);
    }
  } else {
    return next({ code: 400, message: 'Missing username or password' });
  }
};

const register = async (req, res, next) => {
  const { username, password, email, birthdate, bio } = req.body;

  if (username && password && email && birthdate && bio) {
    try {
      const salt = await bcrypt.genSalt(salt);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new UserModel({
        username,
        password: hashPassword,
        email,
        birthdate,
        bio,
      });

      await user.save();

      //Create token
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  } else {
    next({
      code: 400,
      message:
        'Incorrect schema. Missing username, password, email, birthdate or bio',
    });
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const user = await UserModel.findById(user_id, { password: 0, __v: 0, birthdate: 0, _id: 0 });

    if (!user) return next({ code: 404 });

    const followersCount = await Follow.countDocuments({ followed_id: user_id, isAccepted: true });
    const followedCount = await Follow.countDocuments({ follower_id: user_id, isAccepted: true });
    const postCount = await Post.countDocuments({ user_id });
    const likedCount = await ActivityRegister.countDocuments({ user_id, action: "like" });

    const userInfo = {
      ...user._doc,
      liked_count: likedCount,
      followers_count: followersCount,
      followed_count: followedCount,
      posts_count: postCount,
    };

    return res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    next({
      code: 500,
      error
    });
  }
};

export default { login, register, getUserInfo };
