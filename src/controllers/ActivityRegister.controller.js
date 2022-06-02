import mongoose from 'mongoose';
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

// get liked post
const getPostActivity = async (req, res, next, activity) => {
  try {
    const { token_data } = req.body;
    const { user_id: current_user_id } = token_data;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const pipeline = [
      {
        '$match': {
          'user_id': mongoose.Types.ObjectId(user_id),
          'action': activity
        }
      }, {
        '$lookup': {
          'from': 'posts',
          'localField': 'post_id',
          'foreignField': '_id',
          'as': 'post'
        }
      }, {
        '$unwind': '$post'
      },
      {
        '$project': {
          "post": 1,
          "_id": 0,
        }
      },
    ]

    const activityRegister = await ActivityRegisterModel.aggregate(pipeline);

    return res.status(200).json({
      activityRegister
    });
  } catch (error) {
    next({
      code: 500,
      error
    })
  }
};

const getLikedPost = async (req, res, next) => {
  await getPostActivity(req, res, next, 'like');
}

const getSavedPost = async (req, res, next) => {
  await getPostActivity(req, res, next, 'save');
}

export default {
  createLike,
  createComment,
  createSave,
  getLikedPost,
  getSavedPost
};
