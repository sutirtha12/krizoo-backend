const User = require("../models/user_schema");
/* ---------------- ADD TO CART ---------------- */
const newcart = async (req, res) => {
  try {
    console.log(req.userinfo,req.body);
    
    const { productId, size } = req.body;

    const user = await User.findById(req.userinfo.userid);
    if (!user) {
  return res.status(401).json({
    status: "failed",
    message: "Unauthorized"
  });
}

    const existingItem = user.cart.find(
      item =>
        item.productId.toString() === productId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
  productId,
  size,
  quantity: 1
})
}
    await user.save();

    res.json({
      status: "success",
     data:{
      items: user.cart
    }});
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Could not add to cart"
    });
  }
};

/* ---------------- FETCH CART ---------------- */
const fetchcart = async (req, res) => {
  try {
    console.log(req.userinfo.userid);
    const user = await User.findById(req.userinfo.userid).populate("cart.productId");
console.log(user);

if (!user) {
  return res.status(401).json({
    status: "failed",
    message: "Unauthorized"
  });
}
    res.json({
      status: "success",
      data:{
      items: user.cart
    }});
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Could not fetch cart"
    });
  }
};

/* ---------------- UPDATE CART ---------------- */
const updatecart = async (req, res) => {
  try {
    const { productId, action } = req.body;

    if (!["inc", "dec"].includes(action)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid action"
      });
    }

    const user = await User.findById(req.userinfo.userid);

    user.cart = user.cart
      .map(item => {
        if (item.productId.toString() === productId) {
          item.quantity += action === "inc" ? 1 : -1;
        }
        return item;
      })
      .filter(item => item.quantity > 0);

    await user.save();

     const populatedUser = await User.findById(req.userinfo.userid)
      .populate("cart.productId");

    res.json({
      status: "success",
     data:{
      items: populatedUser.cart
    }});
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Could not update cart"
    });
  }
};

/* ---------------- REMOVE ITEM ---------------- */
const deletecart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.userinfo.userid);
    if (!user) {
  return res.status(401).json({
    status: "failed",
    message: "Unauthorized"
  });
}

    user.cart = user.cart.filter(
  item =>
    !(item._id.toString() === itemId)
);

    await user.save();
const populatedUser = await User.findById(req.userinfo.userid)
      .populate("cart.productId");

    res.json({
      status: "success",
      data: {
        items: populatedUser.cart
      }
    });
   } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Could not remove item"
    });
  }
};

module.exports = {
  newcart,
  fetchcart,
  updatecart,
  deletecart
};