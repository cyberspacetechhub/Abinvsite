const jwt = require('jsonwebtoken');

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    // console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            // console.log('JWT decoded:', decoded);
            // console.log('req.user set to:', req.user);
            next();
        }
    );
}

module.exports = verifyJwt;