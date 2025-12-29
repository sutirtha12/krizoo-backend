const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authmiddleware");
const admin = require("../middlewares/adminmiddleware");

const {
  getDashboardStats,
  getAllOrders,
  getAbandonedCarts,
  updateOrderStatus
} = require("../controllers/admin-controller");

router.get("/dashboard", auth, admin, getDashboardStats);
router.get("/orders", auth, admin, getAllOrders);
router.get("/abandoned-carts", auth, admin, getAbandonedCarts);

router.put("/order/update", auth, admin, updateOrderStatus);

module.exports = router;