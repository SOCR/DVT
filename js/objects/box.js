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