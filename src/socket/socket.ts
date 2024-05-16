import express from "express";
import { Server } from "socket.io";
import http from "http";

// INITIAL EXPRESS
const app = express();

// CONFIG URL STATICS

const server = http.createServer(app);
const io = new Server(server);

const usersConnected = new Map();

io.on("connetion", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnet", () => {
    console.log("user disconnected", socket.id);
  });
});

export { app, io, server };
