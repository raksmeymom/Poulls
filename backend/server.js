const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  path: "/socket.io",
});

const PORT = process.env.PORT || 3000;

const listingUpdates = [
  {
    title: "Solar Orchard Townhome",
    location: "Austin, TX",
    tag: "Solar Ready",
    price: "$529,000",
  },
  {
    title: "Bamboo Creek Cottage",
    location: "Portland, OR",
    tag: "Net-Zero",
    price: "$468,000",
  },
  {
    title: "Ridgeview Loft",
    location: "Denver, CO",
    tag: "Urban Green",
    price: "$402,000",
  },
  {
    title: "Evergreen Estate",
    location: "Boulder, CO",
    tag: "Passive House",
    price: "$825,000",
  },
  {
    title: "Rainwater Retreat",
    location: "Santa Fe, NM",
    tag: "Water-Smart",
    price: "$612,000",
  },
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "poulls-backend" });
});

app.use(express.static(path.join(__dirname, "..")));

io.on("connection", (socket) => {
  socket.emit("status", { message: "Realtime listing stream is live." });

  const emitUpdate = () => {
    const update =
      listingUpdates[Math.floor(Math.random() * listingUpdates.length)];
    socket.emit("listingUpdate", update);
  };

  const interval = setInterval(emitUpdate, 12000);
  emitUpdate();

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Poulls backend listening on port ${PORT}`);
});
