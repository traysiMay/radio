import { TOKEN, SET_TRACKS } from "./actions";

const initialState = {
  token: "",
  currentTrack: {},
  nextTracks: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOKEN:
      return { ...state, token: action.token };
    case SET_TRACKS:
      return {
        ...state,
        currentTrack: action.tracks.current_track,
        nextTracks: action.tracks.next_tracks,
      };
    default:
      return state;
  }
};

export default reducer;
