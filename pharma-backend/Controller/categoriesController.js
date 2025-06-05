// controllers/categoryController.js
const Category = require('../models/categoryModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Create a category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ error: 'Category already exists' });

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update a category
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json({ message: 'Category updated', category: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
