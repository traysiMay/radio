import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { socket } from "..";

const Wrapper = styled.div`
  border: 3px solid white;
  max-width: 300px;
  margin: 5rem auto;
  text-align: center;
  height: 250px;
  padding: 3rem;
  color: white;
  font-size: 44px;

  input {
    background: #b3b3b3;
    width: 90%;
    height: 37px;
    border: 3px solid white;
    color: white;
    padding: 0 11px;
  }

  .info {
    font-size: 24px;
    margin: 23px 0px -3px;
  }
  .button {
    width: 22%;
    border: 3px solid white;
    color: white;
    margin: 1rem auto;
    padding: 0.6rem;
    font-size: 21px;
    font-weight: 500;
    cursor: pointer;
  }
`;

const AddForm = ({ addSong, toggleAdd }) => {
  const [uri, setUri] = useState("");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState("");
  useEffect(() => {
    socket.on("response", (response) => {
      setResponse(response);
      setTimeout(() => {
        toggleAdd("add-form");
      }, 1000);
      setTimeout(() => {
        setSending(false);
        setResponse("");
        setUri("");
      }, 1500);
    });
    // eslint-disable-next-line
  }, []);
  const addSongFlow = () => {
    let sendUri = uri;
    if (uri.includes("open.spotify.com")) {
      sendUri = sendUri.split("track/")[1].split("?")[0];
    }
    if (!uri.includes("spotify:track:")) {
      sendUri = "spotify:track:" + sendUri;
    }
    addSong(sendUri);
    setSending(true);
  };

  return (
    <Wrapper className="wrapper">
      {sending && response ? (
        <div>
          {response === 204 && "Your song has been added to the queue :)"}
          {response === 400 &&
            "Oops! either your URI is bad or server is borked :("}
        </div>
      ) : (
        <div>
          <div className="info">Add a song using its Spotify URI</div>
          <input onChange={(e) => setUri(e.target.value)} />
          <div className="button" onClick={addSongFlow}>
            ADD
          </div>
        </div>
      )}
    </Wrapper>
  );
};
export default AddForm;
