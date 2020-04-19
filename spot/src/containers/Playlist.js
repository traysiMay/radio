import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { addSong } from "../actions";
import List from "../components/List";
import Player from "../components/Player";
import Add from "../components/Add";
import Visualizer from "../components/Visualizer";
import AddForm from "../components/AddForm";
import Raptor from "../graphics/Raptor";

const Playlist = ({ addSong, token, currentTrack, nextTracks }) => {
  const [view, setView] = useState("radio");
  const main = useRef();
  const addForm = useRef();
  if (!token) return <Raptor />;
  // if (!currentTrack && !nextTracks)
  //   return <div>sorry, teh radio is offline :(</div>;
  const add = (view) => {
    let translation = 47;
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      translation++;
      const wave = 0.5 * (111 + Math.sin(translation * 0.1) * 110);
      if (wave < 110) {
        if (view === "radio") {
          main.current.style.transform = `translate(${wave}%)`;
          addForm.current.style.transform = `translate(${wave + -110}%)`;
        } else {
          main.current.style.transform = `translate(${110 - wave}%)`;
          addForm.current.style.transform = `translate(${-wave}%)`;
        }
      } else {
        cancelAnimationFrame(frame);
      }
    };
    animate();
    if (view === "radio") setView("add-form");
    if (view === "add-form") setView("radio");
  };

  return (
    <div
      style={{
        overflowX: "hidden",
      }}
    >
      <div style={{ margin: "auto", width: "90%" }}>
        <Add add={add} view={view} />
        <div style={{ transform: "translate(-110%)" }} ref={addForm}>
          <AddForm view={view} addSong={addSong} toggleAdd={add} />
        </div>
        <div
          style={{ marginTop: window.innerWidth < 768 ? "-430px" : "-530px" }}
          ref={main}
        >
          <Player track={currentTrack} />
          <List tracks={nextTracks} />
          <Visualizer />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ token, currentTrack, nextTracks }) => ({
  token,
  currentTrack,
  nextTracks,
});
const mapDispatchToProps = (dispatch) => ({
  addSong: (URI) => dispatch(addSong(URI)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
