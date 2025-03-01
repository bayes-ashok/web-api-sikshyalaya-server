const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User with Email Verification
const registerUser = async (req, res) => {
  try {
    let { fName, email, password, role, phone, image } = req.body;

    if (!role) role = "user";

    const existingUser = await User.findOne({ $or: [{ email }, { fName }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fName,
      email,
      role,
      password: hashPassword,
      phone,
      image,
      verified: false,
      verificationToken,
    });

    await newUser.save();

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email:",email)
  console.log("pw:",password)

  const checkUser = await User.findOne({ email });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  
  // Check if the user is verified before issuing a token
  if (!checkUser.verified) {
    return res.status(403).json({
      success: false,
      message: "Your account is not verified. Please check your email.",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      fName: checkUser.fName,
      email: checkUser.email,
      role: checkUser.role,
      phone: checkUser.phone,
      image: checkUser.image,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        fName: checkUser.fName,
        email: checkUser.email,
        role: checkUser.role,
        phone: checkUser.phone,
        image: checkUser.image,
      },
    },
  });
};

module.exports = { registerUser, verifyEmail, loginUser };
