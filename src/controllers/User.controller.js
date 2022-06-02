import UserModel from '../models/User.model.js';

const login = async (req, res, next) => {
  const query = req.query;

  if (query.user_id) {
    try {
      const mongooseUser = await UserModel.findById(query.user_id);
      if (!mongooseUser) return res.status(200).json({});

      const user = await mongooseUser.toObject();

      return res.status(200).json({ ...user, password: undefined });
    } catch (error) {
      next(error);
    }
  }
};

export default { login };
