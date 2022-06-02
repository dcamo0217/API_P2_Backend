import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  post_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  comment: {
    type: String,
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
});

const ActivityRegister = mongoose.model('ActivityRegister', schema);

export default ActivityRegister;
