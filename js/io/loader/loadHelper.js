/**
 * Created by shusa_000 on 7/2/2015.
 */
"use strict";
goog.provide('DVT.loadHelper');

goog.require('DVT');

/**
 * creates a loadHelper object
 * @class loadHelper
 * @constructor
 * @param index
 * @param filepath
 * @param modalID
 */
DVT.loadHelper=function(index, filepath, modalID)
{
    /**
     * index number in file queue
     * @private
     * @type {number}
     */
    this._index=index;

    /**
     * path of the file to load
     * @private
     * @type {string}
     */
    this._filepath = filepath;

    /**
     * id to html element for load bar
     * @type {string}
     * @private
     */
    this._loadID='loadBar'+this._index;

    /**
     * id to html element for parse progress bar
     * @type {string}
     * @private
     */
    this._parseID='parseBar'+this._index;

    /**
     * id to html element for render progress bar
     * @type {string}
     * @private
     */
    this._renderID='renderBar'+this._index;

    /**
     * id to modal body
     * @type {string}
     * @private
     */
    this._modalID=modalID;

    //add progress bar elements to modal window
    this._addElement(this._loadID);
    this._addElement(this._renderID);
    this._addElement(this._parseID);

    //initialize loading bars and set behavior
    this._parseLine = new ProgressBar.Line('#'+this._parseID, {
        color: '#FC5B3F',
        from: { color: '#FC5B3F'},
        to: { color: '#6FD57F'},
        step: function(state, bar) {
            bar.path.setAttribute('stroke', state.color);
        }
    });
    this._renderLine = new ProgressBar.Line('#'+this._renderID, {
        color: '#FC5B3F',
        from: { color: '#FC5B3F'},
        to: { color: '#6FD57F'},
        step: function(state, bar) {
            bar.path.setAttribute('stroke', state.color);
        }
    });
    this._loadLine = new ProgressBar.Line('#'+this._loadID, {
        color: '#FC5B3F',
        from: { color: '#FC5B3F'},
        to: { color: '#6FD57F'},
        step: function(state, bar) {
            bar.path.setAttribute('stroke', state.color);
        }
    });
};

/**
 * updates progressbar to reflect current loading status
 * @param oEvent the returned event
 */
DVT.loadHelper.prototype.updateLoad=function(oEvent)
{
    if (oEvent.lengthComputable) {
        var percentComplete = oEvent.loaded / oEvent.total;
        this._loadLine.animate(percentComplete);
    } else {
        this._loadLine.animate(0.5);
    }
};

/**
 * updates progressbar to reflect current parsing status
 * @param oEvent the returned event
 */
DVT.loadHelper.prototype.updateParse=function(oEvent)
{
    if (oEvent.lengthComputable) {
        var percentComplete = oEvent.loaded / oEvent.total;
        this._parseLine.animate(percentComplete);
    } else {
        this._parseLine.animate(0.5);
    }
};

/**
 * updates progressbar to reflect current loading status
 * @param oEvent the returned event
 */
DVT.loadHelper.prototype.updateRender=function(oEvent)
{
    if (oEvent.lengthComputable) {
        var percentComplete = oEvent.loaded / oEvent.total;
        this._renderLine.animate(percentComplete);
    } else {
        this._renderLine.animate(0.5);
    }
};

DVT.loadHelper.prototype.finishLoad=function()
{

};

DVT.loadHelper.prototype._addElement=function(elementID)
{
    $('#'+this._modalID+' .modal-body').append('<div id='+ elementID + '></div>');
};

DVT.loadHelper.prototype._removeElement=function()
{

};