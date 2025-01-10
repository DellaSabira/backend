const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

let users = []; // Temporary in-memory storage
let refreshTokens = []; // Temporary storage for refresh tokens

// Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, email, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

// Refresh Token
const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

    const newAccessToken = generateAccessToken({ id: user.id });
    res.json({ accessToken: newAccessToken });
  });
};

// Logout
const logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, refreshToken, logout };
