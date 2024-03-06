import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (req.body)
app.use(cookieParser()); // to parse incoming cookies from req.cookies
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

app.get("/", (req,res) => {
    res.send("Hello Wick");
});

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on server ${PORT}` );
    console.log(`Connected to MongoDB`)
});