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

};
goog.inherits(DVT.mesh, DVT.loaded);

/**
 * sets visibility of particle system on/off
 * @param status {bool} indicator to show/hide particles
 */
DVT.fiber.prototype.showMesh = function (status) {
    if(this.THREEContainer) {
        if (status) {
            this.THREEContainer.visible = true;
        } else {
            this.THREEContainer.visible = false;
        }
    }
    this._meshVisible = status;
};