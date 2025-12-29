const mongoose = require("mongoose")

const productImageSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
   images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("ProductImage", productImageSchema)