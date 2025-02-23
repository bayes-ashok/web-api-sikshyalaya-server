const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  let { fName, email, password, role, phone, image } = req.body;
  console.log(fName, email, password, role, phone, image);

   // Ensure role is set properly
   if (!role) {
    role = "user";
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { fName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    fName,
    email,
    role,
    password: hashPassword,
    phone,
    image,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
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

module.exports = { registerUser, loginUser };
