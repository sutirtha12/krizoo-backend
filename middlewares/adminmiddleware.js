const user = require("../models/user_schema");

const adminmiddleware = async (req, res, next) => {
  try {
    // userid comes from authmiddleware (JWT)
    const userId = req.userinfo.userid;

    const checkuser = await user.findById(userId);

    if (!checkuser) {
      return res.status(401).json({
        status: "failed",
        message: "User not found"
      });
    }

    // 🔑 ONLY ROLE CHECK
    if (checkuser.role !== "admin") {
      return res.status(403).json({
        status: "failed",
        message: "Admin access only"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Admin authorization failed"
    });
  }
};

module.exports = adminmiddleware;