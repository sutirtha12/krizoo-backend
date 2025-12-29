const express = require("express");
const router = express.Router();
const upload = require("../middlewares/image-middleware");
const auth = require("../middlewares/authmiddleware");
const admin = require("../middlewares/adminmiddleware");


const {
  uploadimage,
  createproduct,
  deleteproduct,
  updateproduct,
  fetchproduct,
  fetchsingleproduct,
  fetchAllProductsAdmin,
  deleteProductImage
} = require("../controllers/product-controller");



/* ---------------- PUBLIC ROUTES ---------------- */
router.get("/fetch", fetchproduct);
router.get("/fetch/:id", fetchsingleproduct);

/* ---------------- ADMIN ROUTES ---------------- */

// 1️⃣ Create product (metadata only)
router.post("/upload", auth, admin, createproduct);

// 2️⃣ Upload product images
router.post(
  "/upload-image/:productId",
  auth,
  admin,
  upload.array("images", 6),
  uploadimage
);
router.get("/admin/all", auth, admin, fetchAllProductsAdmin);

// 3️⃣ Update product
router.put("/update/:id", auth, admin, updateproduct);

// 4️⃣ Delete product
router.delete("/delete/:productid", auth, admin, deleteproduct);
router.delete(
  "/delete-image/:imageId",
  auth,
  admin,
  deleteProductImage
);

module.exports = router;