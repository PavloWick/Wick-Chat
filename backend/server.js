import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// Gives absolute path to root folder
const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (req.body)
app.use(cookieParser()); // to parse incoming cookies from req.cookies

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// used to serve static files such as html,css,js, img files, sound files
// dir name is the root folder (WICK-CHAT) so its wick-chat/frontend/dist
// so what this line of code does is basically this is middleware that allows all these to be served static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// This allows us to run our frontend from our server as well
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on server ${PORT}`);
  console.log(`Connected to MongoDB`);
});
