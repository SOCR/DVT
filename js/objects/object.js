/**
 * Created by shusa_000 on 7/7/2015.
 */

goog.provide('DVT.object');

goog.require('DVT.base');

/**
 * base class for all displayable objects
 * @constructor
 * @param copyFrom Object to copy properties from
 * @extends DVT.base
 */
DVT.object = function(copyFrom)
{

    goog.base(this);

    /**
     * container holding the THREE displayable object
     * @type {Object}
     * @public
     */
    this.THREEContainer=null;

    this.obj=12;

    //copies variables from target
    if(copyFrom)
    {
        this.THREEContainer=copyFrom.THREEContainer;
    }
};
goog.inherits(DVT.object, DVT.base);

/**
 * animation subroutines, called post-render
 */
DVT.object.prototype.animate = function () {
    return;
};

/**
 *initialization subroutine, called at object initialization
 * @param renderer {!THREE.renderer} THREE.js renderer object into which object is being drawn
 */
DVT.object.prototype.init = function (renderer) {
    //implement in children
};