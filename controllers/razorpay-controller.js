const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const User = require("../models/user_schema");
const Order = require("../models/order-schema");
const { sendInvoiceMail } = require("../config/mailer");

/* ================= CREATE RAZORPAY ORDER ================= */
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid amount"
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    res.json({
      status: "success",
      data: order
    });
  } catch (err) {
    console.error("RAZORPAY CREATE ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: "Unable to create payment order"
    });
  }
};

/* ================= VERIFY PAYMENT + SAVE ORDER ================= */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      discount,
      shippingDetails
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: "failed",
        message: "Payment verification failed"
      });
    }

    const user = await User.findById(req.userinfo.userid)
      .populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cart empty"
      });
    }

    const items = user.cart.map(i => ({
      productId: i.productId._id,
      size: i.size,
      quantity: i.quantity,
      price: i.productId.discountedPrice || i.productId.price
    }));

    const newOrder = await Order.create({
      user: user._id,
      items,
      amount,
      discount,
      shippingDetails,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    // Clear cart
    user.cart = [];
    user.orders.push(newOrder._id);
    await user.save();

    /* ---------- EMAIL INVOICE ---------- */
    await sendInvoiceMail({
      to: user.email,
      order: {
        orderId: newOrder._id,
        customer: shippingDetails,
        items: items.map(i => ({
          name: i.productId.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price
        })),
        subtotal: amount + discount,
        discount,
        total: amount,
        paymentMethod: "RAZORPAY",
        date: new Date().toLocaleDateString()
      }
    });

    res.json({ status: "success" });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: "Payment verification failed"
    });
  }
};

/* ================= PLACE COD ORDER ================= */
const placeCODOrder = async (req, res) => {
  try {
    const { amount, discount, shippingDetails } = req.body;

    const user = await User.findById(req.userinfo.userid)
      .populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cart empty"
      });
    }

    const items = user.cart.map(i => ({
      productId: i.productId._id,
      size: i.size,
      quantity: i.quantity,
      price: i.productId.discountedPrice || i.productId.price
    }));

    const newOrder = await Order.create({
      user: user._id,
      items,
      amount: amount + 99,
      discount,
      shippingDetails,
      paymentMethod: "COD",
      paymentStatus: "COD"
    });

    user.cart = [];
    user.orders.push(newOrder._id);
    await user.save();

    /* ---------- EMAIL INVOICE ---------- */
    await sendInvoiceMail({
      to: user.email,
      order: {
        orderId: newOrder._id,
        customer: shippingDetails,
        items: items.map(i => ({
          name: i.productId.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price
        })),
        subtotal: amount,
        discount,
        total: amount + 99,
        paymentMethod: "COD",
        date: new Date().toLocaleDateString()
      }
    });

    res.json({ status: "success" });
  } catch (err) {
    console.error("COD ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: "COD order failed"
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  placeCODOrder
};