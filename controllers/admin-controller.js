const mongoose = require("mongoose");
const User = require("../models/user_schema");
const Order = require("../models/order-schema");

/* ================= DASHBOARD STATS ================= */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalOrders = await Order.countDocuments();

    const cartsFilled = await User.countDocuments({
      "cart.0": { $exists: true }
    });

    // ✅ TOTAL REVENUE (ONLY PAID ORDERS)
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      status: "success",
      data: {
        totalUsers,
        totalOrders,
        cartsFilled,
        totalRevenue: revenueAgg[0]?.totalRevenue || 0
      }
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ status: "failed" });
  }
};

/* ================= GET ALL ORDERS (ADMIN) ================= */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("user", "firstname lastname email")
      .sort({ createdAt: -1 });

    const formatted = orders.map(o => ({
      _id: o._id,
      amount: o.amount,
      discount: o.discount,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      items: o.items,
      shippingDetails: o.shippingDetails,
      user: {
        name: o.user.firstname + " " + o.user.lastname,
        email: o.user.email
      }
    }));

    res.json({
      status: "success",
      data: formatted
    });
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ status: "failed" });
  }
};

/* ================= ABANDONED CARTS ================= */
const getAbandonedCarts = async (req, res) => {
  try {
    const users = await User.find(
      { "cart.0": { $exists: true } },
      { password: 0 }
    ).populate("cart.productId");

    res.json({
      status: "success",
      data: users
    });
  } catch (err) {
    console.error("ABANDONED CART ERROR:", err);
    res.status(500).json({ status: "failed" });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ status: "failed", message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ status: "failed", message: "Order not found" });
    }

    if (status !== undefined) order.status = status;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      status: "success",
      data: {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json({ status: "failed" });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  getAbandonedCarts,
  updateOrderStatus
};