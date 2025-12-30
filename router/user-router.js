const express=require("express")
const router=express.Router()
const {signup_controller,login_controller}=require('../controllers/auth-controller')
const authmiddleware = require("../middlewares/authmiddleware");
const user = require("../models/user_schema");

router.post('/signup',signup_controller)
router.post('/login',login_controller)



router.get("/me", authmiddleware, async (req, res) => {
  try {
    const userData = await user
      .findById(req.userinfo.userid)
      .select("-password");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      status: "success",
      data: userData
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});




router.post("/logout", (req, res) => {
  res.json({
    status: "success",
    message: "Logged out"
  });
});


module.exports=router