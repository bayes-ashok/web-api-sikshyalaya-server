// import {User} from '../models/userModel.js';
// import bcrypt from "bcryptjs";
// import { generateToken } from "../utils/generateToken.js";
// import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";


// export const register = async (req,res) => {
//     try{
//         const {name,email,password} =req.body;
//         if(!name || !email || !password){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required."
//             })
//         }
//         const user = await User.findOne({email});
//         if(user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User already exist with this email."
//             })
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//             name,
//             email,
//             password:hashedPassword
//         });
//         return res.status(201).json({
//             success:true,
//             message:"Account created successfully."
//         })
//     } catch(e){
//         console.log(e);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to register."
//         })
//     }
// }


// export const login = async (req,res) => {
//     try {
//         const {email, password} = req.body;
//         if(!email || !password){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required."
//             })
//         }
//         const user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({
//                 success:false,
//                 message:"Incorrect email or password"
//             })
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if(!isPasswordMatch){
//             return res.status(400).json({
//                 success:false,
//                 message:"Incorrect email or password"
//             });
//         }
//         console.log("success")
//         generateToken(res, user, `Welcome back ${user.name}`);

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to login"
//         })
//     }
// }

// export const logout = async (_,res) => {
//     try {
//         return res.status(200).cookie("token", "", {maxAge:0}).json({
//             message:"Logged out successfully.",
//             success:true
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to logout"
//         }) 
//     }
// }
// export const getUserProfile = async (req, res) => {
//     try {
//       console.log('User ID:', req.id);  // Verify the user ID
//       const user = await User.findById(req.id).select("-password");
//       if (!user) {
//         return res.status(404).json({
//           message: "Profile not found",
//           success: false,
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to load user",
//       });
//     }
//   };
//   export const updateProfile = async (req, res) => {
//     try {
//         const userId = req.id;
//         const { name } = req.body;
//         const profilePhoto = req.file;
//         console.log("Request Body:", req.body);
// console.log("Request File:", req.file);


//         if (!name || !profilePhoto) {
//             return res.status(400).json({
//                 message: "Name and profile photo are required.",
//                 success: false,
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found.",
//                 success: false,
//             });
//         }

//         // Delete old photo if exists
//         if (user.photoUrl) {
//             console.log(user.photoUrl);
//             const publicId = user.photoUrl.split("/").pop().split(".")[0];
//             await deleteMediaFromCloudinary(publicId);
//         }

//         // Upload new photo
//         const cloudResponse = await uploadMedia(profilePhoto.path);
//         const photoUrl = cloudResponse.secure_url;


//         // Update user data
//         const updatedData = { name, photoUrl };
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             updatedData,
//             { new: true }
//         ).select("-password");

//         return res.status(200).json({
//             success: true,
//             user: updatedUser,
//             message: "Profile updated successfully.",
//         });
//     } catch (error) {
//         console.error("Error updating profile:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update profile. Please try again later.",
//         });
//     }
// };

import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';

const { hash, compare } = bcrypt;
import jwt from 'jsonwebtoken';

const { sign } = jwt;

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already exist with this email."
        })
    }

    const hashPassword = await hash(password, 10);
    const newUser = new User({
        name,
        email,
        role,
        password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
        success: true,
        message: "User registered successfully!",
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const checkUser = await User.findOne({ email });

    if (!checkUser || !(await compare(password, checkUser.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    const accessToken = sign(
        {
            _id: checkUser._id,
            name: checkUser.name,
            email: checkUser.email,
            role: checkUser.role,
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
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
            },
        },
    });
};

export default { registerUser, loginUser };
