/**
 * Created by shusa_000 on 9/18/2015.
 */

goog.provide('DVT.sphere');

goog.require('DVT.primitives');

/**
 * Class representing cube/sphere surfaces
 * @constructor
 * @param copyFrom
 * @extends DVT.primitives
 */

DVT.sphere = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * radius of sphere
     * @type {number}
     * @private
     */
    this._radius = 1;

    /**
     * center of the sphere. Default is [0,0,0]
     * @type {number[]}
     * @public
     */
    this.center = [0, 0, 0];

    //copies properties from target
    if (copyFrom) {
        this._radius = copyFrom._radius;
    }
};

goog.inherits(DVT.sphere, DVT.primitives);

/**
 * Get the sphere radius.
 *
 * @return {number} radius of the sphere
 * @public
 */
DVT.sphere.prototype.__defineGetter__('radius', function() {

    return this._radius;

});

/**
 * Set the radius of the object
 *
 * @param {number} integer-valued radius
 * @public
 */
DVT.sphere.prototype.__defineSetter__('radius', function(radius) {

    this._radius = radius;
    return this._radius;
});



DVT.sphere.prototype.init = function (renderer) {
    var geometry = new THREE.SphereGeometry(this._radius);
    for(var j=0;j<geometry.vertices.length;j++)
    {
        geometry.vertices[j].add(new THREE.Vector3(this.center[0],this.center[1],this.center[2]))
    }
    geometry.computeFaceNormals();
    //create material
    var material = new THREE.MeshPhongMaterial({color:this._color});

    this.THREEContainer = new THREE.Mesh(geometry, material);
    if(this._voronoiSystem)
    {
        this.calcVoronoi();
    }
}



DVT.sphere.prototype.calcVoronoi = function()
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
    
}