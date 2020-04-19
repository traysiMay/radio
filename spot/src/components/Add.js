import React from "react";
import styled from "styled-components";

const Plus = styled.div`
  border: 3px solid white;
  color: white;
  border-top: 0;
  position: absolute;
  top: -10px;
  right: 14%;
  width: 37px;
  text-align: center;
  height: 38px;
  font-size: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
  cursor: pointer;
  @media (max-width: 768px) {
    top: 0px;
    font-size: 40px;
  }
`;

const Add = ({ add, view }) => {
  return <Plus onClick={() => add(view)}>{view === "radio" ? "+" : ">"}</Plus>;
};
export default Add;
