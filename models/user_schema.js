const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },

    firstname: {
      type: String,
      required: true,
      trim: true
    },

    lastname: {
      type: String,
      required: true,
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    phonenumber: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    /* ---------------- CART ---------------- */
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product"
        },
        size: String,
        quantity: Number
      }
    ],

    /* ---------------- ORDERS ---------------- */
   orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        default:[]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", userschema);