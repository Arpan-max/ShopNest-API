const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/userRepository');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        return next(new ApiError(401, 'Not authorized, user not found'));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized, token failed'));
    }
  } else {
    return next(new ApiError(401, 'Not authorized, no token'));
  }
};

module.exports = authMiddleware;
