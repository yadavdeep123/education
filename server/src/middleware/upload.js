const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsPath = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/quicktime"];

  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only MP4, WebM, and MOV files are allowed"));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

module.exports = upload;
