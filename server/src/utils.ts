import fetch from "node-fetch";
export const PLAYLIST_ID = "51ymsxunGN8n0tnLlfUw5z";
export const USER_ID = "22kk2wrbk25kakd5sifbflp4q";
export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
export const SPOTIFY_ADD_SONG = `https://api.spotify.com/v1/users/${USER_ID}/playlists/${PLAYLIST_ID}/tracks`;
export const SPOTIFY_ADD_TOQ = "https://api.spotify.com/v1/me/player/queue";
export const SPOTIFY_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: "Basic " + process.env.SPOTIFY_64,
};
// https://api.spotify.com/v1/users/{{user_id}}/playlists/{{playlist_id}}/tracks?uris=spotify:track:7y4nKRwnmVSc0AY07KO1Rq
export const AUTH_SPOTIFY_HEADER = (token) => ({
  Authorization: "Bearer " + token,
});

const client_credentials = {
  grant_type: "client_credentials",
};

export const SPOTIFY_BODY = Object.keys(client_credentials)
  .map((key) => {
    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(client_credentials[key])
    );
  })
  .join("&");

const refresh_token =
  "AQBeSQcKPS7utXW-A2rPTMCh2pTkcTwpabj2fN7vfRL2etFxyn8p1fC6hpXNmUSyDa14vL7T_ouhQzQO9nIgyLOfRNyztz5Oo7RVRWXMmOfTpsNSoZCTwIuicaJ654sSEr8";
const refresh = {
  grant_type: "refresh_token",
  refresh_token,
};
export const REFRESH_BODY = Object.keys(refresh)
  .map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(refresh[key]);
  })
  .join("&");

export const getToken = async () => {
  console.log(SPOTIFY_HEADER, "WAHTA");
  const result = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: SPOTIFY_HEADER,
    body: SPOTIFY_BODY,
  }).then((r) => r.json());
  console.log(result);
  return result.access_token;
};

export const getRefreshToken = async () => {
  const results = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + process.env.SPOTIFY_64,
    },
    body: REFRESH_BODY,
  }).then((r) => r.json());
  return results.access_token;
};
export const addSong = async (uri) => {
  const addWhat = SPOTIFY_ADD_TOQ + "?uri=" + uri;
  const access_token = await getRefreshToken();
  console.log(access_token);
  const result = await fetch(addWhat, {
    method: "POST",
    headers: AUTH_SPOTIFY_HEADER(access_token),
  }).then((r) => r.status);
  return result;
};
