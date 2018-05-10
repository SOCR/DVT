
//adapted from the XTK parser @https://github.com/xtk/X

// provides
goog.provide('DVT.parserGIF');

// requires
goog.require('DVT.parser');
goog.require('THREE');
goog.require('gifuct');

/**
 * Create a parser for the .GIF format.
 *
 * @constructor
 * @extends DVT.parser
 */
DVT.parserGIF = function() {

    //
    // call the standard constructor of DVT.base
    goog.base(this);


};
// inherit from DVT.parser
goog.inherits(DVT.parserGIF, DVT.parser);





/**
 * @inheritDoc
 */
DVT.parserGIF.prototype.parse = function( object, data, loader) {

    var geometry = new THREE.Geometry();
    var gif = new GIFuct(data);
    var frames = gif.decompressFrames(true);
    console.log(frames);
    //PARSE HERE

    console.log(geometry)
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.mergeVertices();
    geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    object.THREEContainer = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({color:Math.random() * 0xffffff, wireframe: false, opacity:Math.random(), transparent: true}));
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});


};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserGIF', DVT.parserGIF);
goog.exportSymbol('DVT.parserGIF.prototype.parse', DVT.parserGIF.prototype.parse);