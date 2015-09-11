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
    this._currentParticles = null;

    /**
     * Container for storing all possible particle locations
     * @type {THREE.Object3D}
     * @private
     */
    this._particleLocations = null;

    /**
     * Private variable telling whether fibers are visible. Default: true
     * @type {boolean}
     * @private
     */
    this._fibersVisible = true;

    /**
     * private variable telling whether particles are visible. Default: false
     * @type {boolean}
     * @private
     */
    this._particlesVisible = false;

};
goog.inherits(DVT.fiber, DVT.loaded);

/**
 * sets visibility of particle system on/off
 * @param status {bool} indicator to show/hide particles
 */
DVT.fiber.prototype.showParticles = function (status) {
    if(this._currentParticles) {
        if (status) {
            this._currentParticles.visible = true;
        } else {
            this._currentParticles.visible = false;
        }
        this._particlesVisible = status;
    }
};

/**
 * sets visibility of fiber system on/off
 * @param status indicator to show/hide particles
 */
DVT.fiber.prototype.showFibers = function (status) {
    if(this._fiberContainer) {
        if (status) {
            this._fiberContainer.visible = true;
        } else {
            this._fiberContainer.visible = true;
        }
    }
    this._fibersVisible = status;
};

/**
 * @inheritDoc
 */
DVT.fiber.prototype.animate = function () {

    // swap for ping-pong buffer
    var tmp = fboParticles.in;
    fboParticles.in = fboParticles.out;
    fboParticles.out = tmp;


    simulationShader.uniforms.tPositions.value = fboParticles.in;
    fboParticles.simulate(fboParticles.out);
    material.uniforms.map.value = fboParticles.out;

};

/**
 * @inheritDoc
 */
DVT.fiber.prototype.init = function (renderer) {

}