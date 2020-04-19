import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15% 15% 61%;
  grid-template-rows: 53px 75%;
  color: white;
  max-width: 408px;
  margin: 3% auto 0;
  user-select: none;
`;

const Next = styled.div`
  grid-column: 1 / span 2;
  border: 3px solid white;
  color: white;
  text-align: center;
  padding: 9%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const TrackWrap = styled.div`
  grid-row: 2;
  grid-column: 2 / span 2;
  margin-top: -3px;
  .track {
    border: 3px solid white;
    text-align: center;
    padding: 10%;
    &:not(:last-of-type) {
      border-bottom: 0;
    }

    .name {
      font-size: 20px;
    }
  }
`;

const List = ({ tracks }) => {
  return (
    <Wrapper>
      <Next>NEXT</Next>
      <TrackWrap>
        {tracks &&
          tracks.map((t, i) => (
            <div className="track" key={t.name + i}>
              <div className="name">{t.name}</div>
              {t.artists.map((a, i) => (
                <div className="artist" key={a.name + i}>
                  {a.name}
                </div>
              ))}
            </div>
          ))}
      </TrackWrap>
    </Wrapper>
  );
};
export default List;
