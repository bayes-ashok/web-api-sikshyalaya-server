import express from "express";
import connectDB from './database/db.js'; 
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

// call database connection here
connectDB();
const app = express();


const PORT = process.env.PORT;
// const PORT = 8000;
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:8000",
    credentials:true
}));



app.use("/api/sikshyalaya/user", userRoute);


app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})

