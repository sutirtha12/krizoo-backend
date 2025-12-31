const model = require("../models/user_schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/* ================= SIGNUP ================= */
const signup_controller = async (req, res) => {
  try {
    const {
      username,
      firstname,
      lastname,
      dob,
      phonenumber,
      email,
      role,
      password,
      address
    } = req.body;

    const existing = await model.findOne({
      $or: [{ username }, { email }]
    });

    if (existing) {
      return res.status(409).json({
        status: "failed",
        message: "Username or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await model.create({
      username,
      firstname,
      lastname,
      dob,
      phonenumber,
      email,
      role,
      password: hashedPassword,
      address
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const token = jwt.sign(
      { userid: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });

  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Signup failed"
    });
  }
};

/* ================= LOGIN ================= */
const login_controller = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await model.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect username or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect username or password"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const token = jwt.sign(
      { userid: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });

  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Login failed"
    });
  }
};

module.exports = { signup_controller, login_controller };