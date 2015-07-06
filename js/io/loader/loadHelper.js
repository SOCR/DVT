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
    this._loadID='loadBar'+this._index;
    this._parseID='parseBar'+this._index;
    this._renderID='renderBar'+this._index;

    //add progress bars to modal window
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

DVT.loadHelper.prototype.updateLoad=function()
{

};