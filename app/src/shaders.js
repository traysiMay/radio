export function vertexShader() {
  return `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
  `;
}

export function fragmentShader() {
  return `
precision highp float;

uniform sampler2D u_texture; // texture sampler uniform

varying vec2 vUv;

uniform float time;
uniform float low;
uniform float mid;
uniform float high;

void main(){
    vec4 t2 = texture2D(u_texture, vUv);
    t2 = texture2D(u_texture, vUv).bgra;
    gl_FragColor = vec4(t2.r,t2.g,t2.b,time) * vec4(high/255.,mid/255.,low/255.,0);
}
  `;
}
