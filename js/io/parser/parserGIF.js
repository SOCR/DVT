
//adapted from the XTK parser @https://github.com/xtk/X



// provides
goog.provide('DVT.parserGIF');

// requires
goog.require('DVT.parser');
goog.require('THREE');
goog.require('THREE.Octree');
goog.require('gifuct');
goog.require('voxel-mesh');
goog.require('surface-nets');
goog.require('THREE.SubdivisionModifier');

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

    if(false)
    {
        geometry = this._parseVoxels(totalPixels,dims);
    }
    else
    {
        geometry = this._parseSmooth(totalPixels, dims);
    }

    dims = null;
    totalPixels = null;

    console.log(geometry);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    object.THREEContainer = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({color:0xffffff, wireframe: false, transparent:true}));


    var edges = new THREE.EdgesGeometry( geometry ,15);
    edges.computeBoundingSphere();
    var line = new THREE.Line( edges, new THREE.LineBasicMaterial( { color: 0x000000 , linewidth:50} ), THREE.LinePieces );
    //object.THREEContainer.add( line) ;

    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});


};

/**
 * parses gif grid into a set of cubical voxels, each with a full frame
 * @param totalPixels list of all pixels, 0=blank, >0 = filled
 * @param dims [l,w,h] dimension of the pixel list
 * @returns {THREE.Geometry}
 * @private
 */
DVT.parserGIF.prototype._parseVoxels = function(totalPixels, dims)
{
    var voxelObj = {dims: dims, voxels: totalPixels};
    var mesh = new VoxelMesh(voxelObj);
    var geometry = mesh.geometry;
    mesh = null;
    voxelObj = null;
    geometry.mergeVertices();
    return geometry;
};

DVT.parserGIF.prototype._parseSmooth = function(totalPixels, dims)
{

    geometry = SurfaceNets(totalPixels,dims);
    var modifier = new THREE.BufferSubdivisionModifier(2);
    geometry.mergeVertices();
    this._smoothen(geometry,1,1);
    this._smoothen(geometry,2,4);
    this._smoothen(geometry,.2,6);
    modifier.modify(geometry);
    modifier.modify(geometry);
    return geometry;
};

DVT.parserGIF.prototype._smoothen = function(geometry, factor, weight)
{
    var octree = new THREE.Octree({undeferred:true, radius:.1});
    octree.add( new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0xffffff, wireframe: false, transparent:true})), { useVertices: true } );
    console.log(octree.search(geometry.vertices[1000],1));
    for(var j in geometry.vertices)
    {
        var avg = new THREE.Vector3(0,0,0);
        var test=0;
        var nearest = octree.search(geometry.vertices[j],factor);
        for(var k in nearest)
        {
            avg.add(nearest[k].position)
        }
        avg.divideScalar(nearest.length/weight)
        geometry.vertices[j].add(avg);
        geometry.vertices[j].divideScalar(weight+1)
    }
}

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserGIF', DVT.parserGIF);
goog.exportSymbol('DVT.parserGIF.prototype.parse', DVT.parserGIF.prototype.parse);