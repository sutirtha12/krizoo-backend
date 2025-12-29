const express=require("express")
const router=express.Router()
const {signup_controller,login_controller}=require('../controllers/auth-controller')
const authmiddleware = require("../middlewares/authmiddleware");
const user = require("../models/user_schema");

router.post('/signup',signup_controller)
router.post('/login',login_controller)



router.get("/me", authmiddleware, async (req, res) => {
  const check = await user.findById(req.userinfo.userid).select("-password");

  res.json({
    status: "success",
    data:check
  });
});




router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false // true only in production (HTTPS)
  });

  res.json({
    status: "success",
    message: "Logged out successfully"
  });
});


module.exports=router