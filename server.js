require('dotenv').config()
const express = require("express")
const cors = require("cors")
const database = require("./database/db.js")

const userrouter = require("./router/user-router.js")
const adminrouter = require("./router/admin-router");
const productrouter = require("./router/product-router.js")
const orderrouter = require("./router/order-router.js")
const cartrouter = require("./router/cart-router.js")
const cookieParser = require("cookie-parser")
const razorpayrouter = require("./router/razorpay-router.js");


const app = express()
database()

/* 🔑 CORS — REQUIRED */
app.set("trust proxy", 1);


app.use(cors({
  origin: "krizoo-frontend.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

/* 🔑 MIDDLEWARE ORDER MATTERS */
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api", userrouter)
app.use("/product", productrouter)
app.use("/usercart", cartrouter)
app.use("/payment", razorpayrouter);
app.use("/admin", adminrouter);
app.use("/api", orderrouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.listen(process.env.PORT || 8080, () => {
  console.log("server running")
})