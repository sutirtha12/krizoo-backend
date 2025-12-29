
const mongoose = require("mongoose");
const Product = require("../models/product-schema")
const ProductImage = require("../models/product-imageschema")
const cloudinary = require("../config/cloudinary")

const createproduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const product = await Product.create({
      ...req.body,
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      colors: Array.isArray(req.body.colors) ? req.body.colors : []
    });

    res.status(201).json({
      status: "success",
      data: product
    });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};


const uploadimage = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
console.log(req.files);

    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.public_id
    }));

    const productImages = await ProductImage.findOneAndUpdate(
      { product: productId },
      { $push: { images: { $each: newImages } } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      status: "success",
      data: productImages
    });
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

const fetchproduct= async(req,res)=>{
    try {
        const results=await ProductImage.find().populate('product')
        if(results.length==0){
            return res.json({
                status:"failed",
                message:"empty database /nothing to find"
            })
        }
        res.json({
            status:"sucess",
            data:results
        })
    } catch (error) {
        res.status(500).json({ 
        status: "failed", 
        message:"cant fetch items" 
    })
    }
}

const fetchsingleproduct = async (req, res) => {
  try {
    const product = await ProductImage
      .findOne({ product: req.params.id })
      .populate("product");

    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found"
      });
    }

    res.json({
      status: "success",
      data: product
    });
  } catch {
    res.status(500).json({
      status: "failed",
      message: "Error fetching product"
    });
  }
};



const fetchAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const productsWithImages = await Promise.all(
      products.map(async product => {
        const imageDoc = await ProductImage.findOne({
          product: product._id
        });

        return {
          ...product.toObject(),
          images: imageDoc ? imageDoc.images : []
        };
      })
    );

    res.json({
      status: "success",
      data: productsWithImages
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Cannot fetch products"
    });
  }
};


const updateproduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        sizes: Array.isArray(req.body.sizes) ? req.body.sizes : undefined,
        colors: Array.isArray(req.body.colors) ? req.body.colors : undefined
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found"
      });
    }

    res.json({
      status: "success",
      data: updated
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  }
};






const deleteproduct= async(req,res)=>{
    try {
        const { productid } = req.params

    // 1. Find images
    const productImages = await ProductImage.findOne({ product: productid })

    // 2. Delete images from Cloudinary
    if (productImages && productImages.images.length > 0) {
      for (const img of productImages.images) {
        await cloudinary.uploader.destroy(img.public_id)
      }
    }

    // 3. Delete image document
    await ProductImage.findOneAndDelete({ product: productid })

    // 4. Delete product
    const deletedproduct = await Product.findByIdAndDelete(productid)

    if (!deletedproduct) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found"
      })
}

    res.json({
  status: "success",
  message: "Product deleted"
});
    } catch (error) {
         res.json({ 
        status: "failed", 
        message:"cant update products nothing items" 
    })
}
}

const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const productImages = await ProductImage.findOne({
      "images._id": imageId
    });

    if (!productImages) {
      return res.status(404).json({ status: "failed" });
    }

    const image = productImages.images.id(imageId);

    await cloudinary.uploader.destroy(image.public_id);

    image.remove();
    await productImages.save();

    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "failed" });
  }
};

module.exports={uploadimage,createproduct,deleteproduct,updateproduct,fetchproduct,fetchsingleproduct,fetchAllProductsAdmin,deleteProductImage}