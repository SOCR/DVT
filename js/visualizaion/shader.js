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

DVT.ParticleSimulationF =[

    "varying vec2 vUv;",
    "uniform float width;",
    "uniform sampler2D midMap;",
    "uniform sampler2D allCoordinates;",
    "void main() {",

    "vec4 pos = texture2D( midMap, vUv ).xyzw;",
    "float curLoc = pos.w;",
    "curLoc++;",
    "curLoc-=flow(curLoc%width)==0?width*2:0;",
    "curLoc-=texture2D(allCoordinates, ((curLoc % width)/ width, floor(curLoc/width)/width)).z==999?texture2D(allCoordinates, (((curLoc +1)% width)/ width, floor((curLoc+1)/width)/width)).z:0;",
    "gl_FragColor = (texture2D(allCoordinates, ((curLoc % width)/ width, floor(curLoc/width)/width)).xyz,curLoc);",
    "} "

].join("\n");




// simulation
varying vec2 vUv;

uniform vec3 origin;
uniform sampler2D tPositions;

uniform float timer;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {


    vec3 pos = texture2D( tPositions, vUv ).xyz;

    if ( rand( vUv + timer ) > 0.99 ) {

        pos = origin;

        vec3 random = vec3( rand( vUv + 1.0 ) - 1.0, rand( vUv + 2.0 ) - 1.0, rand( vUv + 3.0 ) - 1.0 );
        pos += normalize( random ) * rand( vUv + 1.0 );

    } else {

        float x = pos.x + timer;
        float y = pos.y;
        float z = pos.z;

        pos.x += sin( y * 3.3 ) * cos( z * 10.3 ) * 0.005;
        pos.y += sin( x * 3.5 ) * cos( z * 10.5 ) * 0.005;
        pos.z += sin( x * 3.7 ) * cos( y * 10.7 ) * 0.005;

    }


    // Write new position out
    gl_FragColor = vec4(pos, 1.0);


}