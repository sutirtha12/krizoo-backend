// middlewares/authmiddleware.js
const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized – token missing"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userinfo = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token"
    });
  }
};

module.exports = authmiddleware;