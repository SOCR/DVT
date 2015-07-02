/**
 * Created by shusa_000 on 7/2/2015.
 */
"use strict";
goog.provide('DVT.loadHelper');

goog.require('DVT');

/**
 * @constructor
 * @param index
 * @param filepath
 */
DVT.loadHelper=function(index, filepath)
{
    this._index=index;
    this._filepath = filepath;
};

DVT.loadHelper.prototype.updateLoad=function()
{
  return;
};