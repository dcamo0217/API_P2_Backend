import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.model.js';

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
      const salt = await bcrypt.genSalt(10);
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

// get user_id by token
const getUserIDByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
};

const getUserByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const mongooseUser = await UserModel.findById(decoded.user_id);
    if (!mongooseUser) return null;
    return mongooseUser;
  } catch (error) {
    return null;
  }
};

export default { login, register, getUserIDByToken, getUserByToken };
