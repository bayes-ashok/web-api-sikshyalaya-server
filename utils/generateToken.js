import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d", // Token expires in 1 day
  });

  // Send token as a cookie and in the response body
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
    })
    .json({
      success: true,
      message: message,
      token: token, // Send token in response body for frontend usage
      user: user, // Send user data as well
    });
};
