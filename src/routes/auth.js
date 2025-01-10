const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");
const { verifyAccessToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Example of a secure route
router.get("/secure", verifyAccessToken, (req, res) => {
  res.json({ message: "This is a secure route", user: req.user });
});

module.exports = router;
