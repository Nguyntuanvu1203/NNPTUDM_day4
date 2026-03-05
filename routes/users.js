var express = require("express");
var router = express.Router();
const { users, roles } = require("../utils/data");

// GET all users
router.get("/", (req, res) => {
  res.json(users);
});

// GET user by username
router.get("/:username", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// CREATE user
router.post("/", (req, res) => {
  const { username, password, email, fullName, avatarUrl, roleId } = req.body;

  // kiểm tra thiếu dữ liệu
  if (!username || !password || !email || !fullName || !roleId) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // kiểm tra username trùng
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username đã tồn tại" });
  }

  // kiểm tra role tồn tại
  const role = roles.find((r) => r.id === roleId);
  if (!role) {
    return res.status(400).json({ message: "Role không tồn tại" });
  }

  const newUser = {
    username,
    password,
    email,
    fullName,
    avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description,
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// UPDATE user
router.put("/:username", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { email, fullName, avatarUrl } = req.body;

  if (email) user.email = email;
  if (fullName) user.fullName = fullName;
  if (avatarUrl) user.avatarUrl = avatarUrl;

  user.updatedAt = new Date().toISOString();

  res.json(user);
});

// DELETE user
router.delete("/:username", (req, res) => {
  const index = users.findIndex((u) => u.username === req.params.username);

  if (index === -1) return res.status(404).json({ message: "User not found" });

  users.splice(index, 1);

  res.json({ message: "Deleted successfully" });
});

module.exports = router;
