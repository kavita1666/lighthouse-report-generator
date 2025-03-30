const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  url: String,
  scores: {
    performance: Number,
    accessibility: Number,
    seo: Number,
    bestPractices: Number,
  },
  summary: String,
  jsonPath: String,
  htmlPath: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
