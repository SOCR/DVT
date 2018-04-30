/**
 * Created by shusa_000 on 9/18/2015.
 */
/**
 * Created by shusa_000 on 9/18/2015.
 */

goog.provide('DVT.primitives');

goog.require('DVT.loaded');
goog.require('THREE.EdgesGeometry');

/**
 * Class representing user-created objects
 * @constructor
 * @param copyFrom
 * @extends DVT.loaded
 */

DVT.primitives = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);
    /**
     * @inheritDoc
     */
    this.file = 'none.none';

    this._loaded = true;

    /**
     * false loader
     * @type {{finishRender: Function}}
     * @private
     */
    this._loader = {finishRender: function () {}};
};

goog.inherits(DVT.primitives, DVT.loaded);

/**
 * Overrides file setting ability
 *
 * @param {number} integer-valued depth
 * @public
 */
DVT.primitives.prototype.__defineSetter__('file', function(file) {
    return file;
});




DVT.primitives.prototype.calcVoronoi = function()
{
    var geom = this.THREEContainer.geometry;
    var curPoint = this._voronoiSystem[this._voronoiIndex]
    for(var j=0;j<this._voronoiSystem.length;j++)
    {
        if(j!=this._voronoiIndex)
        {
            var normal = new THREE.Vector3(curPoint.x, curPoint.y, curPoint.z);
            normal.sub(this._voronoiSystem[j]);
            normal.divideScalar(2);
            
            var plane = new THREE.Plane(normal, 0);
            
            normal = new THREE.Vector3(curPoint.x, curPoint.y, curPoint.z);
            
            
            normal.add(this._voronoiSystem[j]);
            normal.divideScalar(2);
            
            plane.translate(normal);
            
            geom = sliceGeometry(geom, plane, true);
            
            geom.computeFaceNormals();
            geom.computeVertexNormals();
        }
    }
    geom.computeFaceNormals();
    
    //create material
    var material = new THREE.MeshPhongMaterial({color:this._color});

    this.THREEContainer = new THREE.Mesh(geom, material);
    
    var edges =  EdgesGeometry( geom ,15);
    edges.computeBoundingSphere();
    console.log(edges);
    var line = new THREE.Line( edges, new THREE.LineBasicMaterial( { color: 0xffffff , linewidth:50} ), THREE.LinePieces );
    this.THREEContainer.add( line) ;
    
}