/**
 * Created by shusa_000 on 7/7/2015.
 */
"use strict";

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


    //copies variables from target
    if(copyFrom)
    {
        this.THREEContainer=copyFrom.THREEContainer;
    }
};

goog.inherits(DVT.object,DVT.base);