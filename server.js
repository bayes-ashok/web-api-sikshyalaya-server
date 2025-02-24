require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const mediaRoutes = require("./routes/instructor-routes/media-routes");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/shikshyalaya-server", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Call the function
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});


