const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { deleted: false }, // Fetch only non-deleted users
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user || user.deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update a user’s email or password
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const updatedData = {};
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Soft delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { deleted: true }, // Mark user as deleted
    });
    res.json({ message: "User soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
