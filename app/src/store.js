import { createStore } from "redux";
import { ballGenerator } from "./ThreeT";
import THREE from "./ThreeT";
const intialState = {
  ballCount: 2,
  balls: [],
  ballGroup: new THREE.Group(),
  scene: null,
  ready: false,
  analyser: null,
  dataArray: null,
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case "SOCKET_INIT":
      return { ...state, socket: action.socket };
    case "INIT_SCENE":
      const scene = new THREE.Scene();
      scene.add(state.ballGroup);
      return { ...state, scene };
    case "ANALYSER":
      return {
        ...state,
        analyser: action.analyser,
        dataArray: action.dataArray,
      };
    case "NEW_BALL":
      const newBall = ballGenerator(action.ball);
      state.ballGroup.add(newBall);
      return state;
    case "DISCONNECT":
      state.ballGroup.children = state.ballGroup.children.filter(
        (b) => b.userId !== action.ball
      );
      return state;
    case "INIT_BALLS":
      const threeBalls = action.balls.map((b) => ballGenerator(b));
      threeBalls.forEach((b) => state.ballGroup.add(b));
      const newBalls = [...state.balls, action.ball];
      return { ...state, balls: newBalls, ready: true };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
