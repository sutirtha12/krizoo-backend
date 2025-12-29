const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product"
        },
        size: String,
        quantity: Number,
        price: Number
      }
    ],

    amount: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

 shippingDetails: {
      firstname: String,
      lastname: String,
      email: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String
    },

    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "COD"]
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "COD"],
      default: "PENDING"
    },

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PLACED"
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);