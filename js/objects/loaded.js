/**
 * Created by shusa_000 on 7/7/2015.
 */


goog.provide('DVT.loaded');

goog.require('DVT.object');
/**
 * Class representing all displayable objects loaded from file
 * @constructor
 * @param copyFrom
 * @extends DVT.object
 */

DVT.loaded = function(copyFrom)
{
    goog.base(this, 'constructor', copyFrom);

    /**
     * tells whether the data has been loaded and parsed yet
     * @type {boolean}
     * @private
     */
    this._loaded=false;

    /**
     * filepath for the loadable object
     * @type {string}
     */
    this.file='';

    //copies properties from target
    if(copyFrom)
    {
        this.file=copyFrom.file;
        this._loaded=copyFrom._loaded;
    }
};

goog.inherits(DVT.loaded, DVT.object);