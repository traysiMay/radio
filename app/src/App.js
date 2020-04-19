/* eslint react-hooks/exhaustive-deps: 0 */
import React, { useEffect } from "react";
import "./App.css";
import store from "./store";
import { connect } from "react-redux";
import ThreeSpace from "./ThreeSpace";

function App({ ready, scene }) {
  useEffect(() => {
    let analyser, dataArray, audioCtx;
    document.getElementById("play").addEventListener("click", () => {
      if (audioCtx || audio.readyState < 3) return;
      audio.play();
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      var source = audioCtx.createMediaElementSource(audio);
      source.connect(audioCtx.destination);
      source.connect(analyser);
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      store.dispatch({ type: "ANALYSER", dataArray, analyser });
      document.getElementById("play").remove();
    });

    var audio = document.querySelector("audio");
    audio.addEventListener("loadstart", function (event) {
      console.log(event.type);
    });
    audio.addEventListener("loadedmetadata", function (event) {
      console.log(event.type);
    });
    audio.addEventListener("canplay", function (event) {
      console.log(event.type);
      document.getElementById("play").innerText = "PLAY";
    });
    audio.load();
  }, []);
  return (
    <div className="App">
      <div id="loading">loading ballz...</div>
      <div id="play">LOADING STREAM...</div>
      <audio
        crossOrigin="anonymous"
        src={
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000/stream"
            : "https://stream.raptor.pizza/stream"
        }
      ></audio>
      {ready && <ThreeSpace scene={scene} />}
    </div>
  );
}

const mapStateToProps = ({ analyser, ready, scene }) => ({
  analyser,
  ready,
  scene,
});
export default connect(mapStateToProps)(App);
