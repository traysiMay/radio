import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15% 15% 61%;
  grid-template-rows: 45px 75%;
  color: white;
  max-width: 408px;
  margin: 15% auto 51px;
  user-select: none;
`;

const TopBox = styled.div`
  grid-column: 1 / span 2;
  border: 3px solid white;
  grid-row: 1;
  text-align: center;
  padding: 6%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
`;

const TrackName = styled.div`
  margin-top: -3px;
  border: 3px solid white;
  grid-row: 2;
  grid-column: 2 / span 2;
  text-align: center;
  padding: 10%;
  .name {
    font-size: 20px;
  }
`;

const Player = ({ track }) => {
  console.log(track);
  return (
    <Wrapper>
      <TopBox className="play-button">PLAYING</TopBox>
      <TrackName>
        <div className="name">{track ? track.name : "null"}</div>
        <div>
          {/* {track.artists.map((a) => {
            document.title = `${track.name} - ${a.name}`;
            return <div key={a.name}>{a.name}</div>;
          })} */}
        </div>
      </TrackName>
    </Wrapper>
  );
};
export default Player;
