const Order = require("../models/order-schema");

/* ================= GET MY ORDERS ================= */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.userinfo.userid;

    const orders = await Order.find({ user: userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: orders
    });
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: "Unable to fetch orders"
    });
  }
};

/* ================= CANCEL MY ORDER ================= */
const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.userinfo.userid;
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found"
      });
    }

    // ❌ Cannot cancel shipped / delivered orders
    if (["SHIPPED", "DELIVERED"].includes(order.status)) {
      return res.status(400).json({
        status: "failed",
        message: "Order cannot be cancelled now"
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ status: "success" });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: "Unable to cancel order"
    });
  }
};

module.exports = {
  getMyOrders,
  cancelMyOrder
};