import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    follower_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    followed_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    isAccepted: { type: Boolean, required: true, default: false },
});

const Follow = mongoose.model('Follow', schema);

export default Follow;