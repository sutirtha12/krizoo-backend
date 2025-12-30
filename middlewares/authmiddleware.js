// middlewares/authmiddleware.js
const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  try {
    // ✅ READ TOKEN FROM HEADER (WORKS ON MOBILE + SAFARI)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized – token missing"
      });
    }

    // ✅ VERIFY USING ENV SECRET
    const decoded = jwt.verify(token, "sutirtha");

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