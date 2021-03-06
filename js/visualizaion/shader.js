/**
 * Created by shusa_000 on 9/14/2015.
 */

//closure commands
goog.provide('DVT.shader');

DVT.ParticleSimulationV = [

    "varying vec2 vUv;",

    "void main() {",

    "vUv = vec2(uv.x, uv.y);",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "} "

].join("\n");

DVT.ParticleSimulationF = [
    "varying vec2 vUv;",
    "uniform float width;",
    "uniform float mapWidth;",
    "uniform float limit;",
    "uniform sampler2D midMap;",
    "uniform sampler2D allCoordinates;",
    "void main() {",
    "float curLoc = texture2D( midMap, vUv ).w;",
    "curLoc += (vUv.x+vUv.y*mapWidth)*mapWidth < limit?1.0:0.0;",
    "curLoc-=texture2D(allCoordinates, vec2(mod(curLoc, width)/ width, floor(curLoc/width)/width)).z==999.0?texture2D(allCoordinates, vec2(mod((curLoc +1.0), width)/ width, floor((curLoc+1.0)/width)/width)).z:0.0;",
    "gl_FragColor = vec4(texture2D(allCoordinates, vec2(mod(curLoc, width)/ width, floor(curLoc/width)/width)).xyz,curLoc);",
    "} "

].join("\n");


DVT.ParticleRenderV = [
    "uniform sampler2D map;",
    "uniform float width;",
    "varying vec2 vUv;",
    "void main() {",
    "vec2 uv = position.xy + vec2( 0.5 / width, 0.5 / width );",
    "vUv = uv;",
    "vec4 pos = vec4(texture2D( map, uv ).rgb,1.0) ;",
    "vec4 mvPosition =modelViewMatrix * pos;",
    "gl_PointSize = 1.0 * ( 1000.0 / length( mvPosition.xyz ) );",
    "gl_Position = projectionMatrix * mvPosition;",
    "}"
].join("\n");

DVT.ParticleBasicColorF = [

    "uniform sampler2D map;",
    "uniform float width;",
    "varying vec2 vUv;",
    "void main() {",
    "gl_FragColor = vec4(abs(normalize(texture2D( map, vUv ).rgb)), 1.0);",
    "}"

].join("\n");

DVT.ParticleGradientColorF = [

    "uniform sampler2D map;",
    "uniform sampler2D bigMap;",
    "uniform float width;",
    "uniform float bigWidth;",
    "varying vec2 vUv;",
    "void main() {",
    "float prevIndex = texture2D( map, vUv).w;",
    "prevIndex -= 1.0;",
    "vec3 prevCoord = abs( texture2D( map, vUv).xyz - texture2D(bigMap, vec2(mod(prevIndex, bigWidth)/ bigWidth, floor(prevIndex/bigWidth)/bigWidth)).xyz);",
    "gl_FragColor = vec4(prevCoord/length(prevCoord), 1.0);",
    "}"

].join("\n");

DVT.ParticleCurveColorF = [

    "uniform sampler2D map;",
    "uniform sampler2D bigMap;",
    "uniform float width;",
    "uniform float bigWidth;",
    "varying vec2 vUv;",
    "void main() {",
    "float prevIndex = texture2D( map, vUv).w;",
    "prevIndex -= 1.0;",
    "vec3 prevCoord = abs( texture2D( map, vUv).xyz - texture2D(bigMap, vec2(mod(prevIndex, bigWidth)/ bigWidth, floor(prevIndex/bigWidth)/bigWidth)).xyz);",
    "prevCoord/= length(prevCoord);",
    "vec3 nextCord = abs( texture2D( map, vUv).xyz - texture2D(bigMap, vec2(mod(prevIndex - 1.0, bigWidth)/ bigWidth, floor((prevIndex-1.0)/bigWidth)/bigWidth)).xyz);",
    "nextCord /= length(nextCord);",
    "prevCoord -= nextCord;",
    "gl_FragColor = vec4(prevCoord/length(prevCoord), length(prevCoord)*3.55);",
    "}"

].join("\n");
