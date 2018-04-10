/**
 * Created by shusa_000 on 9/21/2015.
 */

goog.provide('DVT.mesh');

goog.require('DVT.loaded');
goog.require('THREE');

/**
 * Class representing dMRI-generated tractography data
 * @param copyFrom Object to copy properties from
 * @extends DVT.loaded
 * @constructor
 */

DVT.mesh = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * THREE.js renderer associated with the object
     * @type {!THREE.renderer}
     * @private
     */
    this._renderer = null;


    /**
     * private variable telling whether mesh is visible. Default: false
     * @type {boolean}
     * @private
     */
    this._meshVisible = true;
    
    this._expandAnimate = false;
    

};
goog.inherits(DVT.mesh, DVT.loaded);

/**
 * sets visibility of mesh on/off
 * @param status {bool} indicator to show/hide mesh
 */
DVT.mesh.prototype.showMesh = function (status) {
    if(this.THREEContainer) {
        if (status) {
            this.THREEContainer.visible = true;
        } else {
            this.THREEContainer.visible = false;
        }
    }
    this._meshVisible = status;
};

DVT.mesh.prototype.init = function (renderer) {
    this._renderer = renderer;
    
    if(this._voronoiSystem)
    {
            
    }
};

DVT.mesh.prototype.calcVoronoi = function()
{
    
}