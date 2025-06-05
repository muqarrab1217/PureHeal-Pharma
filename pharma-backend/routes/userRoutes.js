const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  deleteUser,
  updateUser
} = require('../Controller/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUsers', getAllUsers);
router.get('/profile/:id', getUserProfile);
router.put('/update/:id', updateUser);
router.delete('/remove/:id', deleteUser);
module.exports = router;
