/**
 * Created by shusa_000 on 9/14/2015.
 */

//closure commands
goog.provide('DVT.shader');

DVT.ParticleSimulationV = [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = vec2(uv.x, 1.0 - uv.y);",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "} "

].join("\n");