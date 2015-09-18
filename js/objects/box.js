/**
 * Created by shusa_000 on 9/18/2015.
 */

goog.provide('DVT.box');

goog.require('DVT.object');
goog.require('DVT.loaded');

/**
 * Class representing cube/box surfaces
 * @constructor
 * @param copyFrom
 * @extends DVT.loaded
 */

DVT.box = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * @inheritDoc
     */
    this.file = 'none.noload';

    /**
     * length of box in the y-direction
     * @type {number}
     * @private
     */
    this._length = 1;

    /**
     * length of box in the x-direction
     * @type {number}
     * @private
     */
    this._width = 1;

    /**
     * length of box in the z-direction
     * @type {number}
     * @private
     */
    this._depth = 1;

    //copies properties from target
    if (copyFrom) {
        this._length = copyFrom._length;
        this._width = copyFrom._width;
        this._depth = copyFrom._depth;
    }
};

goog.inherits(DVT.box, DVT.loaded);

/**
 * Get the box length.
 *
 * @return {number} length of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('length', function() {

    return this._length;

});

/**
 * Set the length of the object
 *
 * @param {number} integer-valued length
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('length', function(length) {

    this._length = length;
    return this._length;
});



/**
 * Get the box width.
 *
 * @return {number} width of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('width', function() {

    return this._width;

});

/**
 * Set the width of the object
 *
 * @param {number} integer-valued width
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('width', function(width) {

    this._width = width;
    return this._width;
});



/**
 * Get the box depth.
 *
 * @return {number} depth of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('depth', function() {

    return this._depth;

});

/**
 * Set the depth of the object
 *
 * @param {number} integer-valued depth
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('depth', function(depth) {

    this._depth = depth;
    return this._depth;
});



goog.inherits(DVT.box, DVT.loaded);

/**
 * Alternate getter for the box length.
 *
 * @return {number} length of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('lengthY', function() {

    return this._length;

});

/**
 * Alternate setter for the box length
 *
 * @param {number} integer-valued length
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('lengthY', function(length) {

    this._length = length;
    return this._length;
});



/**
 * Alternate getter for the box width.
 *
 * @return {number} width of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('lengthX', function() {

    return this._width;

});

/**
 * Alternate setter for the box width
 *
 * @param {number} integer-valued width
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('lengthX', function(width) {

    this._width = width;
    return this._width;
});



/**
 * Alternate getter for the box depth.
 *
 * @return {number} depth of the box
 * @public
 */
DVT.box.prototype.__defineGetter__('lengthZ', function() {

    return this._depth;

});

/**
 * SAlternate setter for the box depth
 *
 * @param {number} integer-valued depth
 * @public
 */
DVT.renderer3D.prototype.__defineSetter__('lengthZ', function(depth) {

    this._depth = depth;
    return this._depth;
});

