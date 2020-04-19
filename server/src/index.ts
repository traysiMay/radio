import "reflect-metadata";
const path = require("path");
const fs = require("fs");
require("dotenv").config(
  process.env.NODE_ENV === "development" && {
    path: path.resolve(__dirname, ".env.development"),
  }
);
import { createConnection } from "typeorm";

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import io from "socket.io";
import randomColor from "randomcolor";
import { getToken, addSong } from "./utils";

const app = express();
const server = http.createServer(app);
export const ws = io(server);

app.use(bodyParser.json());
app.locals.balls = [];
app.locals.users = 0;
app.use(
  cors({
    origin: process.env.CLIENT,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "../build")));
app.use("/sendit", express.static(path.join(__dirname, "../public")));

app.use("/static", express.static("assets"));
app.use("/static", express.static("assets"));
function createBall() {
  return {
    x: randomCoord(),
    y: randomCoord(),
    z: randomCoord(),
    color: randomColor(),
  };
}

(async () => {
  await createConnection();
  app.get("/spotify", (req, res) => {
    res.sendFile(path.join(__dirname + "/templates/spotify.html"));
  });
  app.get("/midi", (req, res) => {
    res.sendFile(path.join(__dirname + "/templates/midi.html"));
  });
  app.get("/video", (req, res) => {
    const path = "assets/raptor_kitchen_1.mp4";
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    console.log(fileSize);
    const range = req.headers.range;
    if (range) {
      const parts = (range as any).replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  });

  app.locals.tracks = {};
  app.locals.qId = 0;
  app.locals.rIdMap = [];
  app.locals.readyMap = [];
  app.locals.senderId;
  app.locals.approvedId;
  ws.on("connection", async (socket) => {
    socket.on("receiver", () => {
      socket.join("receivers");
      socket.emit("update_senders", app.locals.rIdMap);
      console.log(socket.id);
    });
    socket.on("sender", () => {
      const qId = app.locals.qId;
      app.locals.rIdMap = [...app.locals.rIdMap, { qId, sId: socket.id }];
      app.locals.qId = qId + 1;
      console.log(app.locals.rIdMap);
      ws.to("receivers").emit("update_senders", app.locals.rIdMap);
      ws.to("receivers").emit("update_ready", {
        readyMap: app.locals.readyMap,
        approvedId: app.locals.approvedId,
      });
      socket.on("ready", () => {
        console.log(app.locals.readyMap);
        if (app.locals.readyMap.includes(socket.id)) return;
        app.locals.readyMap = [...app.locals.readyMap, socket.id];
        ws.to("receivers").emit("update_ready", {
          readyMap: app.locals.readyMap,
          approvedId: app.locals.approvedId,
        });
      });
      socket.on("disconnect", () => {
        console.log("disconnect");
        app.locals.rIdMap = app.locals.rIdMap.filter(
          (i) => i.sId !== socket.id
        );
        ws.to("receivers").emit("update_senders", app.locals.rIdMap);
      });
    });
    socket.on("approve", (sId) => {
      console.log("approving " + sId);
      ws.to(sId).emit("approval", true);
      ws.to(app.locals.approvedId).emit("approval", false);
      socket.emit("approved", sId);
      app.locals.approvedId = sId;
    });
    socket.on("face", (face) => {
      ws.local.emit("face", face);
    });

    socket.on("PLAYER", async () => {
      console.log("player connected");
      socket.on("CURRENT_NEXT_TRACKS", (tracks) => {
        console.log(tracks.current_track.name);
        app.locals.tracks = tracks;
        ws.local.emit("CURRENT_NEXT_TRACKS", tracks);
      });
    });
    socket.on("SPOT_APP", async () => {
      console.log("spot app connect");
      console.log(app.locals.tracks);
      socket.emit("CURRENT_NEXT_TRACKS", app.locals.tracks);
      socket.emit("TOKEN", await getToken());
      socket.on("ADD_SONG", async (uri) => {
        const response = await addSong(uri);
        socket.emit("response", response);
      });
      socket.on("disconnect", () => console.log("spot add disconnect"));
    });

    socket.on("BALL_APP", () => {
      const newBall = createBall();
      const userId = parseInt(app.locals.users) + 1;
      app.locals.users = userId;
      app.locals.balls = [...app.locals.balls, { id: userId, ball: newBall }];
      console.log(app.locals.balls);

      ws.local.emit("INIT_BALLS", app.locals.balls);
      console.log("a user is connected" + userId);
      socket.broadcast.emit("NEW_BALL", {
        ball: createBall(),
      });

      socket.on("disconnect", () => {
        console.log("user has disconnected" + userId);
        // app.locals.balls = app.locals.balls.filter((b) => b.id !== userId);
        // socket.broadcast.emit("DISCONNECT", userId);
      });
    });
  });

  server.listen(4444);
})();

function randomCoord() {
  var num = Math.floor(Math.random() * 5); // this will get a number between 1 and 99;
  return (num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1); // this will add minus
}
