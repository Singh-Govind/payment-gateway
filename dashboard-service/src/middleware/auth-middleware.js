const jwt = require('jsonwebtoken');

const { FORBIDDEN_ERROR } = require('../constants/error-constants');
const { STATUS_FORBIDDEN } = require('../constants/status-codes');

const secretKey = process.env.JWT_SECRET || 'SOME_VERY_STRONG_SECRET_KEY';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        const error = new Error("User is not authorized!");
        error.name = FORBIDDEN_ERROR;
        error.status = STATUS_FORBIDDEN;
        throw error;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            const error = new Error("User is not authorized!");
            error.name = FORBIDDEN_ERROR;
            error.status = STATUS_FORBIDDEN;
            throw error;
        }
        req.user = decoded; 
        next();
    });
};

module.exports = verifyToken;