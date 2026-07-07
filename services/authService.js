const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const register = async (name, email, password) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await userRepository.create(name, email, passwordHash);
  const token = generateToken(user.id, user.role);

  return { user, token };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Remove password_hash from user object before returning
  delete user.password_hash;
  
  const token = generateToken(user.id, user.role);
  return { user, token };
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  register,
  login,
  getProfile
};
