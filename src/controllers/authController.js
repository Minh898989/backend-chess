const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Đăng ký người dùng
const register = (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: 'UserID và mật khẩu là bắt buộc' });
  }

  userModel.findUserByUserId(userid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });
    if (results.length > 0) {
      return res.status(400).json({ message: 'UserID đã tồn tại' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    userModel.createUser(userid, hashedPassword, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi tạo tài khoản' });
      res.status(201).json({ message: 'Đăng ký thành công' });
    });
  });
};

// Đăng nhập người dùng
const login = (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: 'UserID và mật khẩu là bắt buộc' });
  }

  userModel.findUserByUserId(userid, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });
    if (results.length === 0) {
      return res.status(400).json({ message: 'UserID không tồn tại' });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    res.status(200).json({ message: 'Đăng nhập thành công' });
  });
};

module.exports = { register, login };
