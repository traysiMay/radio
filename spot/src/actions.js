import { socket } from "./index";
export const TOKEN = "TOKEN";
export const SET_TRACKS = "SET_TRACKS";

export const addSong = (URI) => {
  return (dispatch, getState) => {
    socket.emit("ADD_SONG", URI);
  };
};
