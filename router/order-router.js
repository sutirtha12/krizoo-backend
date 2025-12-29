const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authmiddleware");
const { getMyOrders,cancelMyOrder } = require("../controllers/order-controller");

router.get("/my-orders", auth, getMyOrders);
router.put("/cancel-order", auth, cancelMyOrder);

module.exports = router;