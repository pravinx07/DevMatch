import {Server} from "socket.io"

export const initSocketIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    // User joins private room
    socket.on("join", (userID, toUserId) => {
      const roomId = [userID, toUserId].sort().join("_");
      socket.join(roomId);

      console.log(` User ${userID} joined private room ${roomId}`);
      io.to(roomId).emit("message", `User ${userID} joined the chat`);
    });

    // Handle private messages
    socket.on("privateMessage", (from, to, message) => {
      const roomId = [from, to].sort().join("_");
      io.to(roomId).emit("privateMessage", { from, message });
      console.log(` ${from} → ${to}: ${message}`);
    });

    // Handle typing indicator
    socket.on("typing", (from, to, isTyping) => {
      const roomId = [from, to].sort().join("_");
      socket.to(roomId).emit("typing", { from, isTyping });
      console.log(`✍️ ${from} is ${isTyping ? "typing..." : "stopped typing"}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

