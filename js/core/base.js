/**
 * Created by shusa_000 on 7/7/2015.
 * Based on code by XTK: https://github.com/xtk/X
 */


// provides
goog.provide('DVT.base');

// requires
goog.require('DVT');
goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * The superclass for all DVT.base-objects. All derived objects will be registered
 * for event handling.
 *
 * @constructor
 * @extends goog.events.EventTarget
 */
DVT.base = function() {//console.count('base');

    //
    // register this class within the event system by calling the superclass
    // constructor
    goog.base(this);

    //
    // class attributes


};
// enable events
goog.inherits(DVT.base, goog.events.EventTarget);


// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.base', DVT.base);
