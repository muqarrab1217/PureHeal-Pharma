const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const serverless = require("serverless-http"); // ✅ Required for Vercel Serverless

const UserRoutes = require("./routes/userRoutes");
const MedicineRoutes = require("./routes/medicineRoutes");
const CategoryRoutes = require("./routes/categoryRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/medicaPharma", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/medicines", MedicineRoutes);
app.use("/api/categories", CategoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send({ activeStatus: true, error: false });
});

// ✅ Export the handler for Vercel serverless
module.exports = app;
module.exports.handler = serverless(app);
