const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Category: { type: String, required: true },
  "Dosage Form": { type: String, required: true },
  Strength: { type: String, required: true },
  Manufacturer: String,
  Indication: String,
  Classification: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  cost: Number,
  Barcode: String,
  SKU: String,
  minStock: Number

}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
