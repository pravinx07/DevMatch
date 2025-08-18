const socket = require("socket.io");

const initSocketIo = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
   io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Example: listen for a message
    socket.on("join", (data) => {
      console.log("Message from client:", data);

      // broadcast back to all clients
      io.emit("message", data);
    });

    // handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
  


module.exports = {initSocketIo}
