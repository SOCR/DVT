
//adapted from the XTK parser @https://github.com/xtk/X

// provides
goog.provide('DVT.parserGIF');

// requires
goog.require('DVT.parser');
goog.require('THREE');
goog.require('gifuct');
goog.require('voxel-mesh');

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

    var geometry;
    var gif = new GIFuct(data);
    var frames = gif.decompressFrames(false);
    var totalPixels = [];
    frames.forEach(function (element) {
        totalPixels = totalPixels.concat(element.pixels);
    });
    var dims = [frames[0].dims.width, frames[0].dims.height, frames.length];
    gif = null;
    frames = null;
    var voxelObj = {dims:dims, voxels: totalPixels};
    var mesh = new VoxelMesh(voxelObj);
    geometry = mesh.geometry;
    dims = null;
    totalPixels = null;
    mesh = null;
    console.log(geometry)
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.mergeVertices();
    geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    object.THREEContainer = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:Math.random()*0xffffff, wireframe: false, opacity:Math.random(), transparent:true}));
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});


};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserGIF', DVT.parserGIF);
goog.exportSymbol('DVT.parserGIF.prototype.parse', DVT.parserGIF.prototype.parse);