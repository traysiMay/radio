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
var node_fetch_1 = __importDefault(require("node-fetch"));
exports.PLAYLIST_ID = "51ymsxunGN8n0tnLlfUw5z";
exports.USER_ID = "22kk2wrbk25kakd5sifbflp4q";
exports.SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
exports.SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
exports.SPOTIFY_ADD_SONG = "https://api.spotify.com/v1/users/" + exports.USER_ID + "/playlists/" + exports.PLAYLIST_ID + "/tracks";
exports.SPOTIFY_ADD_TOQ = "https://api.spotify.com/v1/me/player/queue";
exports.SPOTIFY_HEADER = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + process.env.SPOTIFY_64,
};
// https://api.spotify.com/v1/users/{{user_id}}/playlists/{{playlist_id}}/tracks?uris=spotify:track:7y4nKRwnmVSc0AY07KO1Rq
exports.AUTH_SPOTIFY_HEADER = function (token) { return ({
    Authorization: "Bearer " + token,
}); };
var client_credentials = {
    grant_type: "client_credentials",
};
exports.SPOTIFY_BODY = Object.keys(client_credentials)
    .map(function (key) {
    return (encodeURIComponent(key) +
        "=" +
        encodeURIComponent(client_credentials[key]));
})
    .join("&");
var refresh_token = "AQBeSQcKPS7utXW-A2rPTMCh2pTkcTwpabj2fN7vfRL2etFxyn8p1fC6hpXNmUSyDa14vL7T_ouhQzQO9nIgyLOfRNyztz5Oo7RVRWXMmOfTpsNSoZCTwIuicaJ654sSEr8";
var refresh = {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
};
exports.REFRESH_BODY = Object.keys(refresh)
    .map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(refresh[key]);
})
    .join("&");
exports.getToken = function () { return __awaiter(_this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(exports.SPOTIFY_HEADER, "WAHTA");
                return [4 /*yield*/, node_fetch_1.default(exports.SPOTIFY_TOKEN_URL, {
                        method: "POST",
                        headers: exports.SPOTIFY_HEADER,
                        body: exports.SPOTIFY_BODY,
                    }).then(function (r) { return r.json(); })];
            case 1:
                result = _a.sent();
                console.log(result);
                return [2 /*return*/, result.access_token];
        }
    });
}); };
exports.getRefreshToken = function () { return __awaiter(_this, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node_fetch_1.default(exports.SPOTIFY_TOKEN_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Basic " + process.env.SPOTIFY_64,
                    },
                    body: exports.REFRESH_BODY,
                }).then(function (r) { return r.json(); })];
            case 1:
                results = _a.sent();
                return [2 /*return*/, results.access_token];
        }
    });
}); };
exports.addSong = function (uri) { return __awaiter(_this, void 0, void 0, function () {
    var addWhat, access_token, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addWhat = exports.SPOTIFY_ADD_TOQ + "?uri=" + uri;
                return [4 /*yield*/, exports.getRefreshToken()];
            case 1:
                access_token = _a.sent();
                console.log(access_token);
                return [4 /*yield*/, node_fetch_1.default(addWhat, {
                        method: "POST",
                        headers: exports.AUTH_SPOTIFY_HEADER(access_token),
                    }).then(function (r) { return r.status; })];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
//# sourceMappingURL=utils.js.map