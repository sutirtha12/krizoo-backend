const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const {
  createOrder,
  verifyPayment,
  placeCODOrder
} = require("../controllers/razorpay-controller");

router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);
router.post("/cod", auth, placeCODOrder);

module.exports = router;