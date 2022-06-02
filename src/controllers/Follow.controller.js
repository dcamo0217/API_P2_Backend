import Follow from "../models/Follow.model.js";

const requestFollow = async (req, res, next) => {
    try {
        const { user_id, token_data } = req.body;
        const { user_id: current_user_id } = token_data;



        if (!user_id && !current_user_id) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        if (user_id === current_user_id) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        const alreadyFollowed = await Follow.findOne({
            follower_id: current_user_id,
            followed_id: user_id,
        });

        console.log(alreadyFollowed);

        if (alreadyFollowed) {
            return res.status(400).json({
                error: 'You have already followed this person'
            });
        }

        const follow = await Follow.create({
            follower_id: current_user_id,
            followed_id: user_id,
        });

        return res.status(200).json({ request_id: follow._id });
    } catch (error) {
        next({
            code: 500,
            error
        });
    }
}


const responseFollow = async (req, res, next) => {
    try {
        const { request_id, token_data, action } = req.body;
        const { user_id: current_user_id } = token_data;

        console.log(current_user_id);

        if (!request_id && !current_user_id && !action) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const follow = await Follow.findById(request_id);

        if (!follow) {
            return res.status(400).json({ error: 'Request not found' });
        }

        console.log(follow.followed_id);

        if (!follow.followed_id.equals(current_user_id)) {
            return res.status(400).json({ error: 'You not are the owner of this request.' });
        }

        const isAccepted = action === 'accept';

        await Follow.findByIdAndUpdate(request_id, {
            isAccepted,
        });

        return res.status(200).json({ "success": true });
    } catch (error) {
        next({
            code: 500,
            error
        })
    }
}


export default { requestFollow, responseFollow };