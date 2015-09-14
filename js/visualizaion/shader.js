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

DVT.ParticleSimulationF = [
    "varying vec2 vUv;",
    "uniform float width;",
    "uniform sampler2D midMap;",
    "uniform sampler2D allCoordinates;",
    "void main() {",
    "float curLoc = texture2D( midMap, vUv ).w;",
    "curLoc++;",
    "curLoc-=flow(curLoc%width)==0?width*2:0;",
    "curLoc-=texture2D(allCoordinates, ((curLoc % width)/ width, floor(curLoc/width)/width)).z==999?texture2D(allCoordinates, (((curLoc +1)% width)/ width, floor((curLoc+1)/width)/width)).z:0;",
    "gl_FragColor = (texture2D(allCoordinates, ((curLoc % width)/ width, floor(curLoc/width)/width)).xyz,curLoc);",
    "} "

].join("\n");


DVT.ParticleRenderV = [
    "uniform sampler2D map;",
    "uniform float width;",
    "varying vec2 vUv;",
    "void main() {",
    "vec2 uv = position.xy + vec2( 0.5 / width, 0.5 / width );",
    "vec3 color = texture2D( map, uv ).rgb * 200.0 - 100.0;",
    "gl_PointSize = 1;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( color, 1.0 );",
    "}"
].join("\n");

DVT.ParticleBasicColorV = [

    "void main() {",
    "gl_FragColor = (0.0,1.0,1.0,1.0)",
    "};"

].join("\n");