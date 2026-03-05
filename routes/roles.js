var express = require("express");
var router = express.Router();
const { roles, users } = require("../utils/data");

// GET all roles
router.get("/", (req, res) => {
  res.json(roles);
});

// GET role by id
router.get("/:id", (req, res) => {
  const role = roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).send("Role not found");
  res.json(role);
});

// CREATE role
router.post("/", (req, res) => {
  const newRole = {
    id: "r" + (roles.length + 1),
    name: req.body.name,
    description: req.body.description || "",
  };

  roles.push(newRole);
  res.status(201).json(newRole);
});

// UPDATE role
router.put("/:id", (req, res) => {
  const role = roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).send("Role not found");

  role.name = req.body.name || role.name;
  role.description = req.body.description || role.description;

  res.json(role);
});

// DELETE role
router.delete("/:id", (req, res) => {
  const index = roles.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).send("Role not found");

  roles.splice(index, 1);
  res.send("Deleted successfully");
});

// SPECIAL REQUEST
router.get("/:id/users", (req, res) => {
  const roleUsers = users.filter((u) => u.role && u.role.id === req.params.id);

  res.json(roleUsers);
});

module.exports = router;
