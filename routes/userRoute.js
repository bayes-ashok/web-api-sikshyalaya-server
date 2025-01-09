// import express from "express";
// import { getUserProfile, login, logout, register, updateProfile } from "../controller/userController.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import upload from "../utils/multer.js";


// const router = express.Router();

// router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/logout").post(logout);
// router.route("/auth").get(isAuthenticated);
// router.route("/profile").get(isAuthenticated,getUserProfile);
// router.route("/profile-update").put(isAuthenticated,upload.single("profilePhoto"),updateProfile);
// export default router;


import { Router } from "express";
import userController from "../controller/userController.js";

const { registerUser, loginUser } = userController;

import authenticateMiddleware from '../middlewares/isAuthenticated.js';
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

export default router;