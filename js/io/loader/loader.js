/**
 * Created by shusa_000 on 7/2/2015.
 * loader base class
 */
"use strict";


goog.provide('DVT.loader');

goog.require('DVT');
goog.require('DVT.loadHelper');

DVT.getLoader = (
    function () {
        var resourceLoader=new DVT.loader();
        resourceLoader._init();
        return function () {return resourceLoader;};
    })();

/**
 * Creates a loader for binary or ASCII data
 * @constructor
 */
DVT.loader=function(){

    /**
     * number of active loading bars
     * @type {number}
     * @private
     */
    this._numActive=0;

    /**
     * current status of modal box(hidden vs visible)
     * @type {boolean}
     * @private
     */
    this._visible=false;

    /**
     * HTML selector ID for modal box
     * @type {string}
     * @private
     */
    this._modalID = 'DVTloadbox';

    /**
     * specifies loading index
     * @type {number}
     * @private
     */
    this._curIndex=2;
};

/**
 * Sets up modal box and initial loader conditions
 * @private
 */
DVT.loader.prototype.init=function()
{
    $(document.body).append('<div class="modal fade" id="'+this._modalID+'" tabindex="-1" role="dialog" aria-labelledby="myModal' +
        'Label"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button' +
        'type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></b'+
        'utton><h4 class="modal-title" id="myModalLabel">Modal title</h4></div><div class="modal-body">'+
        'BODY'+
        '</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</b'+
        'utton><button type="button" class="btn btn-primary">Save changes</button></div></div></div></div>');
    return;
};

DVT.loader.prototype.load=function(filepath)
{
var j=0;
    return this._curIndex - 1+j;
};