const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicineModel');

// POST /api/medicines - Create new medicine
router.post('/create-medicine', async (req, res) => {
  const data = req.body;

  try {
    // Check for existing medicine with same Name
    const existing = await Medicine.findOne({ Name: data.Name });

    if (existing) {
      // If name and strength both match, it's a duplicate
      if (existing.Strength === data.Strength) {
        return res.status(400).json({ error: 'Medicine with the same Name and Strength already exists.' });
      }
    }

    // If no exact match or strength differs, allow creation
    const newMedicine = new Medicine(data);
    await newMedicine.save();

    res.status(201).json(newMedicine);
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ error: 'Failed to create medicine' });
  }
});




// Example: GET /api/medicines?page=1&limit=50&search=amox
router.get('/getMedicines', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = (req.query.search) || '';

  const limit = 50;
  const skip = (page - 1) * limit;

  // Match against the correct field name: "Name"
  const query = search
    ? { Name: { $regex: search, $options: 'i' } }
    : {};

  try {
    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data: medicines,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// PUT (update) a medicine by ID
router.put('/update-medicine/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updated = await Medicine.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medicine' });
  }
});

// DELETE a medicine by ID
router.delete('/delete-medicine/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Medicine.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medicine' });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({
      $expr: { $lt: ["$stock", "$minStock"] }
    });

    res.status(200).json(lowStockMedicines);
  } catch (error) {
    console.error('Failed to fetch low stock medicines:', error);
    res.status(500).json({ error: 'Failed to retrieve low stock alerts' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const products = await Medicine.find({
      Name: { $regex: query, $options: 'i' }
    }).limit(100);

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

module.exports = router;
