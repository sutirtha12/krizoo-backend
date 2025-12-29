// middlewares/authmiddleware.js
const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedtoken = jwt.verify(token, "sutirtha");

    // 🔑 THIS IS WHAT YOU USE EVERYWHERE
    req.userinfo = decodedtoken;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authmiddleware;