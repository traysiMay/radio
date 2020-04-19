import React, { useEffect } from "react";
import THREE from "./ThreeT";
import raptorJesus from "./RAPTOR_JESUS.png";
import store from "./store";
import { connect } from "react-redux";
import { vertexShader, fragmentShader } from "./shaders";

const ThreeSpace = ({ analyser, dataArray, scene }) => {
  useEffect(() => {
    let frame, cube;
    const container = document.getElementById("container");
    init();
    function init() {
      document.getElementById("loading").style.display = "none";
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      container.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      console.log(store.getState().ballGroup.children);
      controls.update();
      renderer.setSize(window.innerWidth, window.innerHeight);

      const texture = new THREE.TextureLoader().load(raptorJesus);
      var uniforms = {
        time: { type: "f", value: 1.0 },
        u_texture: { type: "t", value: texture },
        low: { type: "f", value: 255.0 },
        mid: { type: "f", value: 255.0 },
        high: { type: "f", value: 255.0 },
      };
      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        side: THREE.BackSide,
      });

      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 0;
      function animate() {
        frame = requestAnimationFrame(animate);
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
          let lowTotal = 0,
            midTotal = 0,
            highTotal = 0;
          for (let i = 0; i < dataArray.length; i++) {
            if (i < dataArray.length / 3) {
              lowTotal += dataArray[i];
            } else if (i > (dataArray.length * 2) / 3) {
              highTotal += dataArray[i];
            } else {
              midTotal += dataArray[i];
            }
          }
          const lowAverage = lowTotal / 42;
          const midAverage = midTotal / 42;
          const highAverage = highTotal / 42;
          uniforms.low.value = lowAverage ? lowAverage : 255;
          uniforms.mid.value = midAverage;
          uniforms.high.value = highAverage;

          store.getState().ballGroup.children.forEach((b, i) => {
            b.scale.x = (dataArray[i] % 255) / 255 + 1;
            b.scale.y = (dataArray[i] % 255) / 255 + 1;
            b.scale.z = (dataArray[i] % 255) / 255 + 1;
          });
        }
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      }
      animate();
    }
    return () => {
      cancelAnimationFrame(frame);
      scene.remove(cube);
      document.querySelector("canvas").remove();
    };
  }, [dataArray]);
  return <div id="container"></div>;
};

const mapStateToProps = ({ analyser, dataArray }) => ({ analyser, dataArray });
export default connect(mapStateToProps)(ThreeSpace);
