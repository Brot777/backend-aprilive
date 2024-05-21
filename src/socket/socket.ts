import express from "express";
import { Server } from "socket.io";
import http from "http";

// INITIAL EXPRESS
const app = express();

// CONFIG URL STATICS

const server = http.createServer(app);
const io = new Server(server);

const usersConnected = new Map();

export const getSocketIdByUserId = (userId: String) =>
  usersConnected.get(userId);

io.on("connetion", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) usersConnected.set(userId, socket.id);

  socket.on("disconnet", () => {
    console.log("user disconnected", socket.id);
    usersConnected.delete(userId);
  });
});

export { app, io, server };
