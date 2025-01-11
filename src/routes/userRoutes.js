const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

// Secure routes with authentication middleware
router.get("/users", authenticate, getAllUsers);
router.get("/users/:id", authenticate, getUserById);
router.put("/users/:id", authenticate, updateUser);
router.delete("/users/:id", authenticate, deleteUser);

module.exports = router;
