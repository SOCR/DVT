/**
 * Created by shusa_000 on 7/7/2015.
 */


goog.provide('DVT.fiber');

goog.require('DVT.loaded');

/**
 * Class representing dMRI-generated tractography data
 * @param copyFrom Object to copy properties from
 * @extends DVT.loaded
 * @constructor
 */

DVT.fiber = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * Container for storing fiber data
     * @type {THREE.Object3D}
     * @private
     */
    this._fiberContainer = null;

    /**
     * Container for storing current particle locations
     * @type {Array}
     * @private
     */
    this._particleLocations = null;

    /**
     * Container for storing all possible particle locations
     * @type {THREE.Object3D}
     * @private
     */
    this._particlePoints = null;

};
goog.inherits(DVT.fiber, DVT.loaded);
