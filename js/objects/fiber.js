/**
 * Created by shusa_000 on 7/7/2015.
 */
"use strict";

goog.provide('DVT.fiber');

goog.require('DVT.loaded');

DVT.fiber = function(copyFrom)
{
    goog.base(this, 'constructor', copyFrom);


};
goog.inherits(DVT.fiber, DVT.loaded);
