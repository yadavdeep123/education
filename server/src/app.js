const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { getDBMode } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowLocalDevOrigin = (origin) => {
  if (!origin) return true;

  if (envOrigins.includes(origin)) {
    return true;
  }

  // Allow localhost/127.0.0.1 with any port for local Vite dev servers.
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowLocalDevOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    message: "Server is running",
    dbState: states[mongoose.connection.readyState] || "unknown",
    dbMode: getDBMode(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, _req, res, _next) => {
  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({ message: err.message });
  }

  if (err.message && err.message.includes("Only MP4")) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
