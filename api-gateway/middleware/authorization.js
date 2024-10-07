const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'SOME_VERY_STRONG_SECRET_KEY';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        req.isLogged = false;
        return next();
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            req.isLogged = false;
            return next();
        }
        req.user = decoded; 
        req.isLogged = true;
        next();
    });
};

module.exports = verifyToken;