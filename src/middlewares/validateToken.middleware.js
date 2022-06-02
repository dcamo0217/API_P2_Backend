import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.token_data = {
            user_id: decode.user_id,
        }
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


}

export default validateToken;