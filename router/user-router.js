const express=require("express")
const router=express.Router()
const {signup_controller,login_controller}=require('../controllers/auth-controller')
const user = require("../models/user_schema");

router.post('/signup',signup_controller)
router.post('/login',login_controller)




router.post("/logout", (req, res) => {
  res.json({
    status: "success",
    message: "Logged out"
  });
});


module.exports=router