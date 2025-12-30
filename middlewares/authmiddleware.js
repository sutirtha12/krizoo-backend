// middlewares/authmiddleware.js
const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  try {
    // ✅ COOKIE ONLY (production)
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized – token missing"
      });
    }

    // ✅ VERIFY WITH ENV SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ Attach user info
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