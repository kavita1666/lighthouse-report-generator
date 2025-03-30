const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const auditRoutes = require("./routes/auditRoutes");
const mongoose = require("mongoose");

// Load environment variables
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from reports folder
app.use("/reports", express.static(path.join(__dirname, "reports")));

// Routes
app.use("/api/audit", auditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
