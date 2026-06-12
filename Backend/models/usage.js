// const mongoose = require("mongoose");

// const UsageSchema = new mongoose.Schema({
//   appName: String,
//   timeUsed: Number,
//   limit: Number,
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Usage", UsageSchema);



const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  appName: { type: String, required: true },
  usedTime: { type: Number, default: 0 }, // seconds
  limit: { type: Number, required: true }, // seconds
  breakTime: { type: Number, default: 300 }, // seconds
  extensions: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Usage", usageSchema);
