// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }
//     const decode = await jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }
//     req.id = decode.userId;
//     console.log("authenticated")
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default isAuthenticated;


import jwt from "jsonwebtoken";
const { verify } = jwt;


const verifyToken = (token, secretKey) => {
  return verify(token, secretKey);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, "JWT_SECRET");

    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};

export default authenticate;