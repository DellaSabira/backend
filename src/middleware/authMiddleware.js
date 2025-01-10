const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
};

module.exports = { verifyAccessToken };
