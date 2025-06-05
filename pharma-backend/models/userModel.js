const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["customer", "cashier", "admin"], default: 'cashier' }
}, { timestamps: true });

// Create the User model
const User = mongoose.model('User', userSchema);

// Insert a new user
const insertUser = async (user, cb) => {
  try {
    const newUser = new User(user);
    const savedUser = await newUser.save();
    cb(null, savedUser._id);
  } catch (err) {
    cb(err);
  }
};

// Fetch a user by email
const fetchUserByEmail = async (email, cb) => {
  try {
    const user = await User.findOne({ email });
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

// Fetch a user by ID
const fetchUserById = async (userId, cb) => {
  try {
    const user = await User.findById(userId);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};

// Delete a user by ID
const removeUserById = async (userId, cb) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) return cb(null, { message: 'User not found' });
    cb(null, { message: 'User deleted', deletedUser: result });
  } catch (err) {
    cb(err);
  }
};

module.exports = {
  insertUser,
  fetchUserByEmail,
  fetchUserById,
  removeUserById,
  User
};
