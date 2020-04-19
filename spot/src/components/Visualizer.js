import React, { useEffect } from "react";
import PlayButton from "../graphics/PlayButton";

const Visualizer = () => {
  useEffect(() => {
    const playButton = document.querySelector(".play-button");
    let canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 210;

    let centerX = canvas.width / 1.9;
    let centerY = canvas.height / 2;
    let radius = document.body.clientWidth <= 425 ? 50 : 50;
    let steps = document.body.clientWidth <= 425 ? 60 : 50;
    let interval = 360 / steps;
    let pointsUp = [];
    let running = false;
    let pCircle = 2 * Math.PI * radius;
    let angleExtra = 90;

    // Create points
    for (let angle = 0; angle < 360; angle += interval) {
      let distUp = 1.1;

      pointsUp.push({
        angle: angle + angleExtra,
        x:
          centerX +
          radius * Math.cos(((-angle + angleExtra) * Math.PI) / 180) * distUp,
        y:
          centerY +
          radius * Math.sin(((-angle + angleExtra) * Math.PI) / 180) * distUp,
        dist: distUp,
      });
    }

    let context,
      splitter,
      analyserL,
      analyserR,
      bufferLengthL,
      bufferLengthR,
      audioDataArrayL,
      audioDataArrayR;
    //*******

    if (navigator.mediaDevices) {
      initD();
      // initVideo();
    } else {
      console.log("yck");
    }
    function initD() {
      const option = {
        video: false,
        audio: true,
      };
      navigator.mediaDevices
        .getUserMedia(option)
        .then((stream) => {
          toggleAudio(stream);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    //******* */
    const audio = new Audio();
    loadAudio();
    function loadAudio() {
      playButton.style.background = "#8f8fff";
      playButton.innerText = "Loading...";
      audio.loop = false;
      audio.autoplay = false;
      audio.crossOrigin = "anonymous";

      audio.addEventListener("canplay", handleCanplay);
      audio.src =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8000/stream"
          : "https://ice.raptor.pizza/stream";
      audio.load();
    }
    function handleCanplay() {
      playButton.innerHTML = PlayButton();
      playButton.style.background = "none";
      playButton.addEventListener("click", toggleAudio);
    }

    function toggleAudio(stream) {
      if (running === false) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        // const source = context.createMediaElementSource(audio);
        const source = context.createMediaStreamSource(stream);
        splitter = context.createChannelSplitter();

        analyserL = context.createAnalyser();
        analyserL.fftSize = 8192;

        analyserR = context.createAnalyser();
        analyserR.fftSize = 8192;

        splitter.connect(analyserL, 0, 0);
        splitter.connect(analyserR, 1, 0);

        bufferLengthL = analyserL.frequencyBinCount;
        audioDataArrayL = new Uint8Array(bufferLengthL);

        bufferLengthR = analyserR.frequencyBinCount;
        audioDataArrayR = new Uint8Array(bufferLengthR);

        source.connect(splitter);
        if (process.env.NODE_ENV !== "development") {
          splitter.connect(context.destination);
        }
        splitter = context.createChannelSplitter();
      }
      running = true;
      if (audio.paused) {
        audio.play();
        playButton.innerText = "Playing";
        playButton.style.background = "none";
      } else {
        // audio.pause();
      }
    }
    canvas.addEventListener("click", toggleAudio);

    // -------------
    // Canvas stuff
    // -------------

    function drawLine(points) {
      let origin = points[0];

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      ctx.lineJoin = "round";
      ctx.moveTo(origin.x, origin.y);

      for (let i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.lineTo(origin.x, origin.y);
      ctx.stroke();
    }

    function update(dt) {
      let audioIndex, audioValue;

      analyserL.getByteFrequencyData(audioDataArrayL);
      analyserR.getByteFrequencyData(audioDataArrayR);
      for (let i = 0; i < pointsUp.length; i++) {
        audioIndex =
          Math.ceil(pointsUp[i].angle * (bufferLengthL / (pCircle * 2))) | 0;
        audioValue = audioDataArrayL[audioIndex] / 255;

        pointsUp[i].dist = 1.1 + audioValue * 0.8;
        pointsUp[i].x =
          centerX +
          radius *
            Math.cos((-pointsUp[i].angle * Math.PI) / 180) *
            pointsUp[i].dist;
        pointsUp[i].y =
          centerY +
          radius *
            Math.sin((-pointsUp[i].angle * Math.PI) / 180) *
            pointsUp[i].dist;

        audioValue = audioDataArrayR[audioIndex] / 255;
      }
    }

    function draw(dt) {
      requestAnimationFrame(draw);
      if (running) {
        update(dt);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawLine(pointsUp);
    }

    draw();
  }, []);
  return (
    <div style={{ marginTop: window.innerWidth > 768 ? "40px" : "0px" }}>
      <canvas style={{ display: "block", margin: "auto" }} />
    </div>
  );
};
export default Visualizer;
