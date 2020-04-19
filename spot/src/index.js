import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import io from "socket.io-client";
import { TOKEN, SET_TRACKS } from "./actions";

const store = createStore(reducers, applyMiddleware(thunk));

export const socket = io(
  process.env.NODE_ENV === "development" ? "https://radio.raptor.pizza" : "",
  {
    path: "/socket.io",
    transports: ["websocket"],
  }
);

socket.emit("SPOT_APP");
socket.on(TOKEN, (token) => store.dispatch({ type: TOKEN, token }));

socket.on("CURRENT_NEXT_TRACKS", (tracks) =>
  store.dispatch({ type: SET_TRACKS, tracks })
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
