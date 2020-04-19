"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var path = require("path");
var fs = require("fs");
require("dotenv").config(process.env.NODE_ENV === "development" && {
    path: path.resolve(__dirname, ".env.development"),
});
var typeorm_1 = require("typeorm");
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = __importDefault(require("socket.io"));
var randomcolor_1 = __importDefault(require("randomcolor"));
var utils_1 = require("./utils");
var app = express_1.default();
var server = http_1.default.createServer(app);
exports.ws = socket_io_1.default(server);
app.use(body_parser_1.default.json());
app.locals.balls = [];
app.locals.users = 0;
app.use(cors_1.default({
    origin: process.env.CLIENT,
    credentials: true,
}));
app.use(express_1.default.static(path.join(__dirname, "../build")));
app.use("/sendit", express_1.default.static(path.join(__dirname, "../public")));
app.use("/static", express_1.default.static("assets"));
app.use("/static", express_1.default.static("assets"));
function createBall() {
    return {
        x: randomCoord(),
        y: randomCoord(),
        z: randomCoord(),
        color: randomcolor_1.default(),
    };
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.createConnection()];
            case 1:
                _a.sent();
                app.get("/spotify", function (req, res) {
                    res.sendFile(path.join(__dirname + "/templates/spotify.html"));
                });
                app.get("/midi", function (req, res) {
                    res.sendFile(path.join(__dirname + "/templates/midi.html"));
                });
                app.get("/video", function (req, res) {
                    var path = "assets/raptor_kitchen_1.mp4";
                    var stat = fs.statSync(path);
                    var fileSize = stat.size;
                    console.log(fileSize);
                    var range = req.headers.range;
                    if (range) {
                        var parts = range.replace(/bytes=/, "").split("-");
                        var start = parseInt(parts[0], 10);
                        var end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                        var chunkSize = end - start + 1;
                        var file = fs.createReadStream(path, { start: start, end: end });
                        var head = {
                            "Content-Range": "bytes " + start + "-" + end + "/" + fileSize,
                            "Accept-Ranges": "bytes",
                            "Content-Length": chunkSize,
                            "Content-Type": "video/mp4",
                        };
                        res.writeHead(206, head);
                        file.pipe(res);
                    }
                    else {
                        var head = {
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
                exports.ws.on("connection", function (socket) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        socket.on("receiver", function () {
                            socket.join("receivers");
                            socket.emit("update_senders", app.locals.rIdMap);
                            console.log(socket.id);
                        });
                        socket.on("sender", function () {
                            var qId = app.locals.qId;
                            app.locals.rIdMap = app.locals.rIdMap.concat([{ qId: qId, sId: socket.id }]);
                            app.locals.qId = qId + 1;
                            console.log(app.locals.rIdMap);
                            exports.ws.to("receivers").emit("update_senders", app.locals.rIdMap);
                            exports.ws.to("receivers").emit("update_ready", {
                                readyMap: app.locals.readyMap,
                                approvedId: app.locals.approvedId,
                            });
                            socket.on("ready", function () {
                                console.log(app.locals.readyMap);
                                if (app.locals.readyMap.includes(socket.id))
                                    return;
                                app.locals.readyMap = app.locals.readyMap.concat([socket.id]);
                                exports.ws.to("receivers").emit("update_ready", {
                                    readyMap: app.locals.readyMap,
                                    approvedId: app.locals.approvedId,
                                });
                            });
                            socket.on("disconnect", function () {
                                console.log("disconnect");
                                app.locals.rIdMap = app.locals.rIdMap.filter(function (i) { return i.sId !== socket.id; });
                                exports.ws.to("receivers").emit("update_senders", app.locals.rIdMap);
                            });
                        });
                        socket.on("approve", function (sId) {
                            console.log("approving " + sId);
                            exports.ws.to(sId).emit("approval", true);
                            exports.ws.to(app.locals.approvedId).emit("approval", false);
                            socket.emit("approved", sId);
                            app.locals.approvedId = sId;
                        });
                        socket.on("face", function (face) {
                            exports.ws.local.emit("face", face);
                        });
                        socket.on("PLAYER", function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log("player connected");
                                socket.on("CURRENT_NEXT_TRACKS", function (tracks) {
                                    console.log(tracks.current_track.name);
                                    app.locals.tracks = tracks;
                                    exports.ws.local.emit("CURRENT_NEXT_TRACKS", tracks);
                                });
                                return [2 /*return*/];
                            });
                        }); });
                        socket.on("SPOT_APP", function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b, _c;
                            var _this = this;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        console.log("spot app connect");
                                        console.log(app.locals.tracks);
                                        socket.emit("CURRENT_NEXT_TRACKS", app.locals.tracks);
                                        _b = (_a = socket).emit;
                                        _c = ["TOKEN"];
                                        return [4 /*yield*/, utils_1.getToken()];
                                    case 1:
                                        _b.apply(_a, _c.concat([_d.sent()]));
                                        socket.on("ADD_SONG", function (uri) { return __awaiter(_this, void 0, void 0, function () {
                                            var response;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, utils_1.addSong(uri)];
                                                    case 1:
                                                        response = _a.sent();
                                                        socket.emit("response", response);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        socket.on("disconnect", function () { return console.log("spot add disconnect"); });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        socket.on("BALL_APP", function () {
                            var newBall = createBall();
                            var userId = parseInt(app.locals.users) + 1;
                            app.locals.users = userId;
                            app.locals.balls = app.locals.balls.concat([{ id: userId, ball: newBall }]);
                            console.log(app.locals.balls);
                            exports.ws.local.emit("INIT_BALLS", app.locals.balls);
                            console.log("a user is connected" + userId);
                            socket.broadcast.emit("NEW_BALL", {
                                ball: createBall(),
                            });
                            socket.on("disconnect", function () {
                                console.log("user has disconnected" + userId);
                                // app.locals.balls = app.locals.balls.filter((b) => b.id !== userId);
                                // socket.broadcast.emit("DISCONNECT", userId);
                            });
                        });
                        return [2 /*return*/];
                    });
                }); });
                server.listen(4444);
                return [2 /*return*/];
        }
    });
}); })();
function randomCoord() {
    var num = Math.floor(Math.random() * 5); // this will get a number between 1 and 99;
    return (num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1); // this will add minus
}
//# sourceMappingURL=index.js.map