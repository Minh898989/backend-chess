const express = require("express");
const multer = require("multer");
const { uploadAvatar, getUserProfile } = require("../controllers/avtController");

const router = express.Router();

// Cấu hình Multer để xử lý file tải lên
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route lấy thông tin người dùng
router.get("/:userid", getUserProfile);

// Route upload avatar
router.post("/upload-avatar/:userid", upload.single("avatar"), uploadAvatar);

module.exports = router;
