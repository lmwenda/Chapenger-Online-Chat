import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { Server } from "socket.io";
import { BASE_URL, ORIGIN_BASE_URL } from "./utils/endpoints";
import express, { Router } from 'express';

// Configurations

dotenv.config();

// Initializations

const router = Router();
const port: any = process.env.PORT || 5000;
const app = express();
const server = http.createServer(serverless(app));
export const io = new Server(server, {
    cors: {
        origin: ORIGIN_BASE_URL,
        methods: ["GET", "POST"],
    }
}).listen(port)

// Routes and Middlewares
app.use(
  cors({
    exposedHeaders: "",
    origin: ORIGIN_BASE_URL,
    
  })
);
app.use(express.json());

// Sockets 

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`USER WITH ID: ${socket.id} JOINED ROOM: ${data}`)
    })
    
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    })
    
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id)
    })
})


app.use('./netlify/functions/', router)

export default serverless(app);