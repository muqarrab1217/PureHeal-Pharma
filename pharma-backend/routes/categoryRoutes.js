const express = require('express');
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require('../Controller/categoriesController');

router.get('/getCategories', getAllCategories);
router.post('/create', createCategory);
router.put('/update/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;
