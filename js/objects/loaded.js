/**
 * Created by shusa_000 on 7/7/2015.
 */
"use strict";

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
};

goog.inherits(DVT.loaded, DVT.object);