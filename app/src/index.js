import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import io from "socket.io-client";
import store from "./store";
import { Provider } from "react-redux";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:4444" : ""
);
socket.emit("BALL_APP");
store.dispatch({ type: "INIT_SCENE" });

socket.on("INIT_BALLS", (balls) => {
  store.dispatch({ type: "INIT_BALLS", balls });
});
socket.on("NEW_BALL", (ball) => {
  store.dispatch({ type: "NEW_BALL", ball });
});
socket.on("DISCONNECT", (ball) => {
  store.dispatch({ type: "DISCONNECT", ball });
});
store.dispatch({ type: "SOCKET_INIT", socket });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
