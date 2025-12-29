const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: [
        "compression-tshirt",
        "sports-bra",
        "leggings",
        "oversize-tshirt",
        "joggers",
        "hoodie"
      ],
      required: true
    },

    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discountedPrice: {
      type: Number
    },

    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"]
        },
        stock: {
          type: Number,
          required: true
        }
      }
    ],

    colors: [
      {
        name: String,
        hex: String
      }
    ],

    material: {
      type: String, // e.g. Nylon Spandex, Poly Spandex
      required: true
    },

    gsm: {
      type: Number // fabric weight (e.g. 180)
    },

    fit: {
      type: String,
      enum: ["compression", "regular", "oversized"]
    },
    ratings: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("product", productSchema)