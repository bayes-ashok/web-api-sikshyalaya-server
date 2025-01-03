import express from "express";
import connectDB from './database/db.js'; 

// call database connection here
connectDB();
const app = express();

// const PORT = process.env.PORT || 3000;
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})

