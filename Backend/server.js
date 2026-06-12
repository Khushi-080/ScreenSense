const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/screensense"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error", err));

// =======================
// HISTORY SCHEMA
// =======================
const historySchema = new mongoose.Schema({
  app: String,
  date: String,
  duration: Number,
  timestamp: String,
});

const History = mongoose.model("History", historySchema);

// =======================
// HISTORY ROUTES
// =======================

// GET ALL HISTORY
app.get("/api/history", async (req, res) => {
  try {
    const data = await History.find().sort({ _id: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE HISTORY
app.post("/api/history", async (req, res) => {
  try {
    const newData = new History(req.body);
    await newData.save();

    res.json({
      success: true,
      message: "Saved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE HISTORY
app.delete("/api/history", async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({
      success: true,
      message: "History cleared",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server Running",
  });
});

// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});