/**
 * Created by shusa_000 on 7/2/2015.
 * loader base class
 */


goog.provide('DVT.loader');

goog.require('DVT');
goog.require('DVT.loadHelper');
goog.require('jQuery');

/**
 * Creates a loader for binary or ASCII data
 * @class loader
 * @constructor
 */
DVT.loader=function(){

    /**
     * number of active loading bars
     * @type {number}
     * @private
     */
    this._numActive = 0;

    /**
     * current status of modal box(hidden vs visible)
     * @type {boolean}
     * @private
     */
    this._visible = false;

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
    this._curIndex = 0;
};

/**
 * Sets up modal box and initial loader conditions
 * @private
 */
DVT.loader.prototype.init = function () {console.count('loader.init');
    $('body').append('<div class="modal fade" id="' + this._modalID + '" tabindex="-1" role="dialog" aria-labelledby="myModal' +
        'Label"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button' +
        'type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></b'+
        'utton><h4 class="modal-title" id="myModalLabel">Modal title</h4></div><div class="modal-body">'+
        'BODY'+
        '</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</b'+
        'utton><button type="button" class="btn btn-primary">Save changes</button></div></div></div></div>');
    return;
};

DVT.loader.prototype.load = function(container) {console.count('loader.load');
    container._locked = true;
    var filePath = container.file;
    this._numActive += 3;

    //add load bars
    var helper = new DVT.loadHelper(this._curIndex, filePath, this._modalID, container);

    //listen for load bar completion event
    goog.events.listen(helper, 'PROGRESS', function(){console.count('loader.PROGRESS');
        this._numActive -= 1;
        if(this._numActive === 0)
        {
            $('#'+this._modalID).modal('hide');
        }}, false, this);

    //load data
    helper.load();

    //increment and return index
    this._curIndex += 1;
    return this._curIndex - 1;
};


$(function(){
    DVT.getLoader = (
        function () {
            var resourceLoader = new DVT.loader();
            resourceLoader.init();
            return function () {return resourceLoader;};
        })();
});

