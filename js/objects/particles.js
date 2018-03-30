/**
 * Created by shusa_000 on 9/18/2015.
 */

goog.provide('DVT.particles');

goog.require('DVT.primitives');


/**
 * Class representing cube/box surfaces
 * @constructor
 * @param copyFrom
 * @extends DVT.primitives
 */

DVT.particles = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * length of box in the y-direction
     * @type {number}
     * @private
     */
    this._length = 1;

    this._numPoints = 10;
    
    /**
     * center of the cube. Default is [0,0,0]
     * @type {number[]}
     * @public
     */
    this.center = [0, 0, 0];

    //copies properties from target
    if (copyFrom) {
        this._length = copyFrom._length;
    }
    
    
};

goog.inherits(DVT.particles, DVT.primitives);

/**
 * Get the box length.
 *
 * @return {number} length of the box
 * @public
 */
DVT.particles.prototype.__defineGetter__('length', function() {

    return this._length;

});

/**
 * Set the length of the object
 *
 * @param {number} integer-valued length
 * @public
 */
DVT.particles.prototype.__defineSetter__('length', function(length) {

    this._length = length;
    return this._length;
});


DVT.particles.prototype.init = function (renderer) {
    var geometry = new THREE.Geometry();
    for(var j=0;j<this._numPoints;j++)
    {
        geometry.vertices.push(new THREE.Vector3((Math.random()-.5)*this._length,(Math.random()-.5)*this._length,(Math.random()-.5)*this._length))
    }

    this.THREEContainer = new THREE.PointCloud(geometry, new THREE.PointCloudMaterial({ color: 0xff11cc }));
    console.log(this.THREEContainer);
}
