const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token = req.headers["authorization"];
  token = req.headers["authorization"].replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, "random_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
