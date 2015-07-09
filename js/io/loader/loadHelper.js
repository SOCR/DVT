/**
 * Created by shusa_000 on 7/2/2015.
 */
goog.provide('DVT.loadHelper');

goog.require('DVT');
goog.require('goog.events');
goog.require('ProgressBar');
goog.require('bootstrap');
goog.require('DVT.parserTRK');

/**
 * creates a loadHelper object
 * @class loadHelper
 * @constructor
 * @param index
 * @param filepath
 * @param modalID
 */
DVT.loadHelper = function (index, filepath, modalID, container) {

    goog.base(this);

    /**
     * index number in file queue
     * @private
     * @type {number}
     */
    this._index = index;

    var re = /(?:\.([^.]+))?$/;

    /**
     * file extension of target
     * @type {Array|{index: number, input: string}}
     * @private
     */
    this._extension = re.exec(filepath)[1];

    /**
     * path of the file to load
     * @private
     * @type {string}
     */
    this._filepath = filepath;

    /**
     * container which needs to accept the loaded data
     * @private
     * @type {DVT.loaded}
     */
    this._container = container;

    /**
     * id to html element for load bar
     * @type {string}
     * @private
     */
    this._loadID = 'loadBar' + this._index;

    /**
     * id to html element for parse progress bar
     * @type {string}
     * @private
     */
    this._parseID = 'parseBar' + this._index;

    /**
     * id to html element for render progress bar
     * @type {string}
     * @private
     */
    this._renderID = 'renderBar' + this._index;

    /**
     * id to modal body
     * @type {string}
     * @private
     */
    this._modalID = modalID;

    //add progress bar elements to modal window
    this._addElement(this._loadID, 'Loading ' + this._filepath);
    this._addElement(this._parseID, 'Parsing ' + this._filepath);
    this._addElement(this._renderID, 'Rendering ' + this._filepath);
    this._container._loader = this;

    //initialize loading bars and set behavior
    this._parseLine = new ProgressBar.Line('#' + this._parseID, {
        color: '#FC5B3F',
        from: { color: '#FC5B3F'},
        to: { color: '#6FD57F'},
        step: function (state, bar) {
            bar.path.setAttribute('stroke', state.color);
        }
    });
    this._renderLine = new ProgressBar.Line('#' + this._renderID, {
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
goog.inherits(DVT.loadHelper, DVT.base);

/**
 * initiates XHR and parsing protocol
 */
DVT.loadHelper.prototype.load = function () {
    $('#' + this._modalID).modal('show');
    var XHR = new XMLHttpRequest();

    //add events for listening
    XHR.addEventListener("progress", this.updateLoad.bind(this), false);
    goog.events.listen(XHR, 'load', this.finishLoad.bind(this, XHR));

     // abort events
    goog.events.listen(XHR, 'abort', this.loadFailed.bind(this));

    // error events
    goog.events.listen(XHR, 'error', this.loadFailed.bind(this));

    XHR.open('GET', this._filepath, true);

    //configures request for binary data, if necessary
    if (this.isBinary()) {
        XHR.responseType = 'arraybuffer';
    }


    //finalize request
    XHR.send();
};

/**
 * Selects appropriate parser based on file extension
 * @param data
 * @private
 */
DVT.loadHelper.prototype._parseInit = function(data) {
    switch (this._extension) {
        case 'trk':
            var parser = new DVT.parserTRK();
            parser.parse(this._container, data, this);
            break;
        default:
            alert('Parser not found');
    }
};

DVT.loadHelper.prototype.loadFailed = function () {
    console.log('LOAD FAILED');
    alert('load failed');
}

/**
 * updates progressbar to reflect current loading status
 * @param oEvent the returned event
 */
DVT.loadHelper.prototype.updateLoad =function(oEvent) {
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
DVT.loadHelper.prototype.updateParse=function(percentComplete)
{
    this._parseLine.animate(percentComplete);
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

DVT.loadHelper.prototype.finishLoad = function(XHR) {
    if(XHR.status === 404)
    {
        alert('error: file not found');
        return;
    }
    this._loadLine.animate(1,this._removeElement.bind(this, this._loadID, this._loadLine));
    goog.events.listenOnce(this._container, 'PROCESSED', this.finishParse,false,this);
    this._parseInit(XHR.response);

};

DVT.loadHelper.prototype.finishParse = function() {
    this._parseLine.animate(1,this._removeElement.bind(this, this._parseID, this._parseLine));
};

DVT.loadHelper.prototype.finishRender = function() {
    this._renderLine.animate(1,this._removeElement.bind(this, this._renderID, this._renderLine));
};

DVT.loadHelper.prototype._addElement = function(elementID, message) {
    $('#' + this._modalID + ' .modal-body').append('<div id = holder' + elementID + '><span>' + message + '</span><span id=' + elementID + '></span></div><br>');
};

DVT.loadHelper.prototype._removeElement=function(elementID, bar)
{
    $('#holder' + elementID).fadeOut(700,function(){
        $('#holder' + elementID).css({"visibility":"hidden",display:'block'}).slideUp();
        this.dispatchEvent.bind(this, {type:'PROGRESS'});
    });
};

/**
 * determines wether file needs to be parsed as binary or JSON style data
 * @returns {boolean}
 */
DVT.loadHelper.prototype.isBinary = function () {
    switch(this._extension) {
        case 'trk':
            return true;
            break;
        default:
            return false
    }
};