const express = require("express");
const path = require("path");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/video", auth(["instructor", "admin"]), upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${path.basename(req.file.path)}`;

  return res.status(201).json({
    message: "Video uploaded successfully",
    videoUrl: fileUrl,
    fileName: req.file.filename,
    size: req.file.size,
  });
});

module.exports = router;
