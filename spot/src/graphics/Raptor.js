import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
  margin: 0rem auto 0rem;
  height: 100%;
  max-width: 360px;
  color: black;
  display: block;
`;

const Raptor = ({
  bg = "grey",
  fill = "none",
  opacity = 1,
  reff,
  stroke = "#FFFFFF",
}) => (
  <Svg ref={reff} x="0px" y="0px" viewBox="0 0 864 864">
    <path
      fill={bg}
      d="M704.172,432.004c0-150.322-121.847-272.176-272.167-272.176c-150.313,0-272.177,121.854-272.177,272.176
c0,150.321,121.863,272.169,272.177,272.169C582.325,704.172,704.172,582.325,704.172,432.004z"
    />

    <path
      stroke={stroke}
      fill={fill}
      opacity={opacity}
      strokeWidth="10"
      strokeMiterlimit="10"
      d="M623.373,394.194v-34.077l-120.796-34.103l-22.437,66.463
l-129.417,60.525l-135.987-70.14l-6.756,15.581l133.588,116.586l57.817-7.664l19.241,32.798l-40.041,34.124
c9.488,10.356,60.784,36.836,60.784,36.836l25.191-2.766l-34.262-35.532l25.89-17.396l12.872-58.715l62.837-24.296l-3.854,33.212
l14.588,3.42l24.923-51.034l-46.001-18.883l15.536-49.255L623.373,394.194z"
    />
  </Svg>
);

export default Raptor;
