import ActivityRegisterModel from '../models/ActivityRegister.model.js';

// create activity register
export const createActivityRegister = async (req, res, next, action) => {

  try {
    const { post_id, token_data } = req.body;
    const { user_id } = token_data;
    if (!post_id || !user_id) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    if (action === 'comment') {
      const { comment } = req.body;
      if (comment) {
        await ActivityRegisterModel.create({
          post_id,
          user_id,
          comment,
          action
        });
      } else {
        return res.status(400).json({
          message: 'comment is required',
        });
      }
    } else {
      await ActivityRegisterModel.create({
        post_id,
        user_id,
        action,
      });

    }
    return res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    next({
      code: 500,
      error
    });
  }
};

//create like activity register
const createLike = async (req, res, next) => {
  await createActivityRegister(req, res, next, 'like');
};

//create comment activity register
const createComment = async (req, res, next) => {
  await createActivityRegister(req, res, next, 'comment');
};

//create save activity register
const createSave = async (req, res, next) => {
  await createActivityRegister(req, res, next, 'save');
};

export default {
  createLike,
  createComment,
  createSave,
};
