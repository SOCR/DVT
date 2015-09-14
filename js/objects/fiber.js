/**
 * Created by shusa_000 on 7/7/2015.
 */


goog.provide('DVT.fiber');

goog.require('DVT.loaded');
goog.require('DVT.shader');
goog.require('THREE');
goog.require('THREE.FBOUtils');

/**
 * Class representing dMRI-generated tractography data
 * @param copyFrom Object to copy properties from
 * @extends DVT.loaded
 * @constructor
 */

DVT.fiber = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * THREE.js renderer associated with the object
     * @type {!THREE.renderer}
     * @private
     */
    this._renderer = null;

    /**
     * manages simulation and texture rendering shaders
     * @type {THREE.FBOUtils}
     * @private
     */
    this._FBOManager = null;

    /**
     * shaders used for particleSystem rendering
     * @type {THREE.SHaderMaterial}
     * @private
     */
    this._renderMaterial = null;

    /**
     * shaders used for particleSystem simulation
     * @type {THREE.SHaderMaterial}
     * @private
     */
    this._simMaterial = null;

    /**
     * Container for storing fiber data
     * @type {THREE.Object3D}
     * @private
     */
    this._fiberContainer = null;

    /**
     * Container for storing current particle locations
     * @type {THREE.Object3D}
     * @private
     */
    this._currentParticles = null;

    /**
     * Container for storing all possible particle locations
     * @type {THREE.DataTexture}
     * @private
     */
    this._particleLocations = null;

    /**
     * texture file holding particle mapping matrix
     * @type {THREE.DataTexture}
     * @private
     */
    this._particleMap = null;

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

    /**
     * indicates whether animation is enabled for particle system
     * @type {boolean}
     * @private
     */
    this._particlesAnimated = true;

    /**
     * width of mapping matrix (always a power of 2)
     * @type {number}
     * @private
     */
    this._mapWidth = 0;

    /**
     * width of coordinate matrix/texture (always a power of 2)
     * @type {number}
     * @private
     */
    this._coordinateWidth = 0;

    /**
     * number of total particles rendered in particleSystem
     * @type {number}
     * @private
     */
    this._numParticles = 0;
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
 * enables or disables animation for particles
 * @param status {boolean}
 */
DVT.fiber.prototype.enableAnimation = function (status) {
    this._particlesAnimated = status;
};

/**
 * @inheritDoc
 */
DVT.fiber.prototype.animate = function () {

    if(this._particlesAnimated && this._particlesVisible) {

        // swap for ping-pong buffer
        var tmp = fboParticles.in;
        fboParticles.in = fboParticles.out;
        fboParticles.out = tmp;

        //load simulator, run, and update results
        this._simMaterial.uniforms.midMap.value = fboParticles.in;
        fboParticles.simulate(fboParticles.out);
        this._renderMaterial.uniforms.map.value = fboParticles.out;
    }
};

/**
 * @inheritDoc
 */
DVT.fiber.prototype.init = function (renderer) {
    this._renderer = renderer;
    var simShader = new THREE.ShaderMaterial({

        uniforms: {
            midMap: { type: "t", value: this._particleMap },
            allCoordinates: { type: "t", value: this._particleLocations },
            limit: { type: "f", value: this._numParticles },
            width: { type: "f", value: this._coordinateWidth },
            mapWidth: { type: "f", value: this._mapWidth }
        },

        vertexShader: DVT.ParticleSimulationV,
        fragmentShader:  DVT.ParticleSimulationF

    });

    this._simMaterial = simShader;

    //create simulation manager
    this._FBOManager = new THREE.FBOUtils( this._mapWidth, this._renderer, simShader);

    //setup simulation render target
    this._FBOManager.in = new THREE.WebGLRenderTarget(this._mapWidth, this._mapWidth, {
        wrapS:THREE.RepeatWrapping,
        wrapT:THREE.RepeatWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type:THREE.FloatType,
        stencilBuffer: false
    });

    //setup ping-pong simulation render target
    this._FBOManager.out = this._FBOManager.in.clone();
    this._FBOManager.renderToTexture(this._particleMap, this._FBOManager.out);
    console.log('INIT DONE');
};