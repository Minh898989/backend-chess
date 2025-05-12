const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadAvatar, getUserProfile } = require("../controllers/avtController");

// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// GET user profile
router.get("/:userid", getUserProfile);

// POST upload avatar
router.post("/upload-avatar/:userid", upload.single("avatar"), uploadAvatar);

module.exports = router;
