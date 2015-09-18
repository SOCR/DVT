/**
 * Created by shusa_000 on 9/18/2015.
 */
/**
 * Created by shusa_000 on 9/18/2015.
 */

goog.provide('DVT.primitives');

goog.require('DVT.loaded');

/**
 * Class representing user-created objects
 * @constructor
 * @param copyFrom
 * @extends DVT.loaded
 */

DVT.box = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * @inheritDoc
     */
    this.file = 'none.none';

    /**
     * false loader
     * @type {{finishRender: Function}}
     * @private
     */
    this._loader = {finishRender: function () {}};
};

goog.inherits(DVT.box, DVT.loaded);

/**
 * Overrides file setting ability
 *
 * @param {number} integer-valued depth
 * @public
 */
DVT.box.prototype.__defineSetter__('file', function(file) {
    return file;
});
