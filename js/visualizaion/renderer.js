/**
 * Created by shusa_000 on 6/29/2015.
 */

"use strict";


goog.provide('DVT.renderer');



// requires
/*
 goog.require('DVT.camera');
 goog.require('DVT.camera2D');
 goog.require('DVT.camera3D');
 goog.require('DVT.cube');
 goog.require('DVT.cylinder');
 goog.require('DVT.interactor2D');
 goog.require('DVT.interactor3D');
 goog.require('DVT.labelmap');
 goog.require('DVT.object');
 goog.require('DVT.sphere');
 goog.require('DVT.volume');
 goog.require('THREE')
 goog.require('DVT.interactor');
 goog.require('goog.events');
 goog.require('goog.events.EventType');

 */
goog.require('DVT.base');
goog.require('goog.dom');
//goog.require('DVT.dataContainer');
//goog.require('DVT.event');
//goog.require('DVT.array');
goog.require('DVT.loader');
//goog.require('DVT.progressbar');
//goog.require('goog.Timer');

/**
 * The superclass for all renderers.
 *
 * @constructor
 * @extends DVT.base
 */
DVT.renderer = function() {

    /**
     * The HTML container of this renderer, E.g. a <div>.
     *
     * @type {!Element|HTMLBodyElement}
     * @protected
     */
    this._container = window.document.body;

    /**
     * The Canvas of this renderer.
     *
     * @type {?Element}
     * @public
     */
    this._canvas = null;

    /**
     * The rendering context of this renderer.
     *
     * @type {?Object}
     * @protected
     */
    this._context = null;

    /**
     * The width of this renderer.
     *
     * @type {!number}
     * @public
     */
    this._width = this._container.clientWidth;

    /**
     * The height of this renderer.
     *
     * @type {!number}
     * @public
     */
    this._height = this._container.clientHeight;


    /**
     * array containing all renderable top-level objects
     * @type {Array}
     * @private
     */
    this._objects = [];


    /**
     * The loader associated with this renderer.
     *
     * @type {?DVT.loader}
     * @protected
     */
    this._loader = null;

    /**
     * The configuration of this renderer.
     *
     * @enum {boolean}
     */
    this._config = {
        'PROGRESSBAR_ENABLED': true,
        'INTERMEDIATE_RENDERING': false,
        'SLICENAVIGATORS': true
    };


    /**
     * The progressBar of this renderer.
     *
     * @type {?DVT.progressbar}
     * @protected
     */
    this._progressBar = null;

    /**
     * The progressBar for computing progress.
     *
     * @type {?DVT.progressbar}
     * @protected
     */
    this._progressBar2 = null;

    // ________________________________________________________________________________________________________________________
    // ________________________________________________________________________________________________________________________
    // ________________________________________________________________________________________________________________________
    // ________________________________________________________________________________________________________________________
    //
    // call the standard constructor of DVT.base
    goog.base(this);



    window.console
        .log('XTK release 10 -- ###TIMESTAMP### -- http://www.goXTK.com -- @goXTK');

};
// inherit from DVT.base
goog.inherits(DVT.renderer, DVT.base);


/**
 * The callback for DVT.event.events.COMPUTING events which indicate computing
 * for volume rendering
 *
 * @param {!DVT.event.ComputingEvent} event The computing event.
 * @public
 */
DVT.renderer.prototype.onComputing = function(event) {

    // stop the rendering loop
    window.cancelAnimationFrame(this._AnimationFrameID);

    // only do the following if the progressBar was not turned off
    if (this._config['PROGRESSBAR_ENABLED']) {

        this._progressBar2 = new DVT.progressbar(this._container, 3);

    }

};


/**
 * The callback for DVT.event.events.COMPUTING_END events which indicate the end of computing
 * for volume rendering
 *
 * @param {!DVT.event.ComputingEndEvent} event The computing end event.
 * @public
 */
DVT.renderer.prototype.onComputingEnd = function(event) {

    // only do the following if the progressBar was not turned off
    if (this._config['PROGRESSBAR_ENABLED']) {

        if (this._progressBar2) {

            // show a green, full progress bar
            this._progressBar2.done();

            // wait for a short time
            this.__readyCheckTimer2 = goog.Timer.callOnce(function() {

                this.__readyCheckTimer2 = null;

                if (this._progressBar2) {

                    // we are done, kill the progressbar
                    this._progressBar2.kill();
                    this._progressBar2 = null;

                }

                // // we don't want to call onShowtime again
                this._onShowtime = true;
                this._loadingCompleted = true;

                // restart the rendering loop
                this.render();

            }.bind(this), 700);
            // .. and jump out
            return;

        } // if progressBar still exists

    } // if progressBar is enabled

};


/**
 * The callback for DVT.event.events.COMPUTING_PROGRESS events which indicate progress
 * updates during computing.
 *
 * @param {!DVT.event.ComputingProgressEvent} event The progress event holding the total
 *          progress value.
 * @public
 */
DVT.renderer.prototype.onComputingProgress = function(event) {

    if (this._progressBar2) {

        var _progress = event._value;
        this._progressBar2.setValue(_progress * 100);

    }

};


/**
 * The callback for DVT.event.events.PROGRESS events which indicate progress
 * updates during loading.
 *
 * @param {!DVT.event.ProgressEvent} event The progress event holding the total
 *          progress value.
 * @public
 */
DVT.renderer.prototype.onProgress = function(event) {

    if (this._progressBar) {

        var _progress = event._value;
        this._progressBar.setValue(_progress * 100);

    }

};

//***********PASTE??**********
/**
 * The callback for DVT.event.events.MODIFIED events which re-configures the
 * object for rendering. This does not trigger re-rendering.
 *
 * @param {!DVT.event.ModifiedEvent} event The modified event pointing to the
 *          modified object.
 * @public
 */
DVT.renderer.prototype.onModified = function(event) {console.log('Function call: onModified in renderer')

    if (goog.isDefAndNotNull(event) && event instanceof DVT.event.ModifiedEvent) {

        if (!event._dataContainer) {
            // we need an object here
            return;

        }

        this.update_(event._dataContainer);

    }

};

/**
 * The callback for DVT.event.events.REMOVE events which re-configures the
 * object for rendering. This does not trigger re-rendering.
 *
 * @param {!DVT.event.RemoveEvent} event The modified event pointing to the
 *          modified object.
 * @public
 */
//***********PASTE??**********
DVT.renderer.prototype.onRemove = function(event) {

    if (goog.isDefAndNotNull(event) && event instanceof DVT.event.RemoveEvent) {

        if (!event._object) {

            // we need an object here
            return;

        }

        this.remove(event._object);

    }

};


/**
 * The callback for DVT.event.events.HOVER events which indicate a hovering over
 * the viewport.
 *
 * @param {!DVT.event.HoverEvent} event The hover event pointing to the relevant
 *          screen coordinates.
 * @throws {Error} An error if the given event is invalid.
 * @protected
 */
DVT.renderer.prototype.onHover_ = function(event) {

    if (!goog.isDefAndNotNull(event) || !(event instanceof DVT.event.HoverEvent)) {

        throw new Error('Invalid hover event.');

    }

};


/**
 * @protected
 */
DVT.renderer.prototype.onResize_ = function() {
    this.resize();
};


/**
 * Resizes the control to fit the size of the container.
 */
DVT.renderer.prototype.resize = function() {

    // grab the new width and height of the container
    var container = goog.dom.getElement(this._container);
    this._width = container.clientWidth;
    this._height = container.clientHeight;

    // propagate it to the canvas
    var canvas = goog.dom.getElement(this._canvas);
    canvas.width = this._width;
    canvas.height = this._height;

    if (this._classname == 'renderer3D') {

        // modify 3d viewport
        this._context.viewport(0, 0, this._width, this._height);

        // modify perspective
        this._camera._perspective = DVT.matriDVT.makePerspective(DVT.matriDVT.identity(), this._camera._fieldOfView, (this._canvas.width/this._canvas.height), 1, 10000);

    }

    // .. and re-draw
    //this.resetViewAndRender();

};


/**
 * The callback for DVT.event.events.SCROLL events which indicate scrolling of the
 * viewport.
 *
 * @param {!DVT.event.ScrollEvent} event The scroll event indicating the scrolling
 *          direction.
 * @throws {Error} An error if the given event is invalid.
 * @protected
 */
DVT.renderer.prototype.onScroll_ = function(event) {

    if (!goog.isDefAndNotNull(event) || !(event instanceof DVT.event.ScrollEvent)) {

        throw new Error('Invalid scroll event.');

    }

};


/**
 * Access the configuration of this renderer. Possible settings and there
 * default values are:
 *
 * <pre>
 * config.PROGRESSBAR_ENABLED: true
 * config.INTERMEDIATE_RENDERING: false
 * config.SLICENAVIGATORS: true
 * config.PROGRESSBAR_ENABLED: true
 * </pre>
 *
 * @return {Object} The configuration.
 */
DVT.renderer.prototype.__defineGetter__('config', function() {

    return this._config;

});


/**
 * Get the interactor of this renderer. The interactor is null until this
 * renderer is initialized.
 *
 * @return {?DVT.interactor} The interactor.
 */
DVT.renderer.prototype.__defineGetter__('interactor', function() {

    return this._interactor;

});


/**
 * Get the camera of this renderer. The camera is null until this renderer is
 * initialized.
 *
 * @return {?DVT.camera} The camera.
 */
DVT.renderer.prototype.__defineGetter__('camera', function() {

    return this._camera;

});


/**
 * Check if the initial loading of all objects was completed. This value gets
 * set immediately after the onShowtime function is executed.
 *
 * @return {boolean} TRUE if all objects were completely loaded, FALSE else
 *         wise.
 */
DVT.renderer.prototype.__defineGetter__('loadingCompleted', function() {

    return this._loadingCompleted;

});


/**
 * Get the container of this renderer.
 *
 * @return {!Element|HTMLBodyElement} The container of this renderer.
 * @public
 */
DVT.renderer.prototype.__defineGetter__('container', function() {

    return this._container;

});


/**
 * Set the container for this renderer. This has to happen before
 * DVT.renderer.init() is called.
 *
 * @param {!string|Element|HTMLBodyElement} container Either an ID to a DOM
 *          container or the DOM element itself.
 * @throws {Error} An error, if the given container is invalid.
 * @public
 */
DVT.renderer.prototype.__defineSetter__('container', function(container) {

    // check if a container is passed
    if (!goog.isDefAndNotNull(container)) {

        throw new Error('An ID to a valid container (<div>..) is required.');

    }

    // check if the passed container is really valid
    var _container = container;

    // if an id is given, try to get the corresponding DOM element
    if (goog.isString(_container)) {

        _container = goog.dom.getElement(container);

    }

    // now we should have a valid DOM element
    if (!goog.dom.isElement(_container)) {

        throw new Error('Could not find the given container.');

    }

    this._container = _container;

});


/**
 * Resets the view according to the global bounding box of all associated
 * objects, the configured camera position as well as its focus _and_ triggers
 * re-rendering.
 */
DVT.renderer.prototype.resetViewAndRender = function() {

    this._camera.reset();
    // this.render_(false, false);

};


/**
 * Shows the loading progress bar by modifying the DOM tree.
 *
 * @protected
 */
DVT.renderer.prototype.showProgressBar_ = function() {

    // only do the following if the progressBar was not turned off
    if (this._config['PROGRESSBAR_ENABLED']) {

        // create a progress bar here if this is the first render request and the
        // loader is working
        if (!this._progressBar) {

            this._progressBar = new DVT.progressbar(this._container, 3);

        }

    }

};


/**
 * Hides the loading progress bar.
 *
 * @protected
 */
DVT.renderer.prototype.hideProgressBar_ = function() {

    // only do the following if the progressBar was not turned off
    if (this._config['PROGRESSBAR_ENABLED']) {

        if (this._progressBar && !this.__readyCheckTimer2) {

            // show a green, full progress bar
            this._progressBar.done();

            // wait for a short time
            this.__readyCheckTimer2 = goog.Timer.callOnce(function() {

                this.__readyCheckTimer2 = null;

                if (this._progressBar) {

                    // we are done, kill the progressbar
                    this._progressBar.kill();
                    this._progressBar = null;

                }

                this.render();

            }.bind(this), 700);
            // .. and jump out
            return;

        } // if progressBar still exists

    } // if progressBar is enabled

};


/**
 * Create the canvas of this renderer inside the configured container and using
 * attributes like width, height etc. Then, initialize the rendering context and
 * attach all necessary objects (e.g. camera, shaders..). Finally, initialize
 * the event listeners.
 *
 * @param {string} _contextName The name of the context to create.
 * @throws {Error} An exception if there were problems during initialization.
 * @protected
 */
DVT.renderer.prototype.init = function(_contextName) {

    // create the canvas
    var _canvas = goog.dom.createDom('canvas');

    //
    // append it to the container
    goog.dom.appendChild(this._container, _canvas);
    if(this._classname=='renderer3D')
    {

    }
    this._width = this._container.clientWidth;
    this._height = this._container.clientHeight;

    // width and height can not be set using CSS but via object properties
    _canvas.width = this._width;
    _canvas.height = this._height;

    this._canvas=_canvas;
    this._loader = DVT.getLoader();
    this._context = this._canvas.getContext(_contextName);

    // listen to a progress event which gets fired during loading whenever
    // progress was made
    //TODO update event
    //goog.events.listen(this._loader, DVT.event.events.PROGRESS, this.onProgress.bind(this));

};


/**
 * Add a new object to this renderer. The renderer has to be initialized before
 * doing so. A DVT.renderer.render() call has to be initiated to display added
 * objects.
 *
 * @param {!DVT.object} object The object to add to this renderer.
 * @throws {Error} An exception if something goes wrong.
 */
DVT.renderer.prototype.add = function(object) {

    // for constructable objects (e.g. cube, sphere, cylinder), we call the
    // modified() function to generate the CSG representations
    /*  if (object instanceof DVT.cube || object instanceof DVT.sphere ||
     object instanceof DVT.cylinder) {

     object.modified();

     } */

    // we know that objects which are directly added using this function are def.
    // top-level objects, meaning that they do not have a parent
    //this._topLevelObjects.push(object);

    this.update_(object);

};


/**
 * Remove an existing object and all its children from the rendering context.
 *
 * @param {!DVT.object} object The object to remove from the renderer.
 * @return {boolean} TRUE or FALSE depending on success.
 * @throws {Error} An exception if something goes wrong.
 * @public
 */
DVT.renderer.prototype.remove = function(object) {

    if (!this._canvas || !this._context) {

        throw new Error('The renderer was not initialized properly.');

    }

    if (!goog.isDefAndNotNull(object)) {

        //throw new Error('Illegal object.');

    }
    else{

        goog.events.removeAll(object);

        var _numberOfTopLevelObjects = this._topLevelObjects.length;

        var _y;
        for (_y = 0; _y < _numberOfTopLevelObjects; _y++) {

            if(this._topLevelObjects[_y]._id == object._id){
                this._topLevelObjects[_y] = null;
                this._topLevelObjects.splice(_y, 1);
                return true;
            }
        }
    }

    // to be overloaded

    return false;

};


/**
 * Configure a displayable object within this renderer. The object can be a
 * newly created one or an existing one. A DVT.renderer.render() call has to be
 * initiated to display the object.
 *
 * @param {!DVT.object} object The displayable object to setup within this
 *          renderer.
 * @throws {Error} An exception if something goes wrong.
 * @protected
 */
DVT.renderer.prototype.update_ = function(object) {console.log('Function Call: update_ in renderer')
    if (!this._canvas || !this._context) {

        throw new Error('The renderer was not initialized properly.');

    }

    if (!goog.isDefAndNotNull(object)) {
        //window.console.log(object);
        //window.console.log('Illegal object');
        //throw new Error('Illegal object.');

    }
    else {

        if(!goog.events.hasListener(object, DVT.event.events.MODIFIED)) {

            goog.events.listen(object, DVT.event.events.MODIFIED, this.onModified
                .bind(this));

        }

        if(!goog.events.hasListener(object, DVT.event.events.REMOVE)) {

            goog.events.listen(object, DVT.event.events.REMOVE, this.onRemove
                .bind(this));

        }

        if(!goog.events.hasListener(object, DVT.event.events.COMPUTING)) {

            goog.events.listen(object, DVT.event.events.COMPUTING, this.onComputing
                .bind(this));

        }

        if(!goog.events.hasListener(object, DVT.event.events.COMPUTING_PROGRESS)) {

            goog.events.listen(object, DVT.event.events.COMPUTING_PROGRESS, this.onComputingProgress
                .bind(this));

        }

        if(!goog.events.hasListener(object, DVT.event.events.COMPUTING_END)) {

            goog.events.listen(object, DVT.event.events.COMPUTING_END, this.onComputingEnd
                .bind(this));

        }

    }

};


/**
 * Get the existing DVT.object with the given id.
 *
 * @param {!number} id The object's id.
 * @return {?DVT.object} The requested DVT.object or null if it was not found.
 * @throws {Error} If the given id was invalid.
 * @public
 */
DVT.renderer.prototype.get = function(id) {

    if (!goog.isDefAndNotNull(id)) {

        throw new Error('Invalid object id.');

    }

    // loop through objects and try to find the id
    var _objects = this._objects.values();
    var _numberOfObjects = _objects.length;

    var _k = 0;
    for (_k = 0; _k < _numberOfObjects; _k++) {

        if (_objects[_k]._id == id) {

            // found!
            return _objects[_k];

        }

    }

    // not found
    return null;

};


/**
 * Print the full hierarchy tree of objects.
 *
 * @public
 */
DVT.renderer.prototype.printScene = function() {

    var _numberOfTopLevelObjects = this._topLevelObjects.length;
    // window.console.log(_numberOfTopLevelObjects);
    // window.console.log(this._objects);

    var _y;
    for (_y = 0; _y < _numberOfTopLevelObjects; _y++) {

        var _topLevelObject = this._topLevelObjects[_y];

        this.generateTree_(_topLevelObject, 0);

    }

};


/**
 * Recursively loop through a hierarchy tree of objects and print it.
 *
 * @param {!DVT.object} object The starting point object.
 * @param {number} level The current level in the scene hierarchy.
 * @protected
 */
DVT.renderer.prototype.generateTree_ = function(object, level) {

    // for slices, container is right size but empty
    if(typeof(object) == 'undefined'){
        return;
    }

    var _output = "";

    var _l = 0;
    for (_l = 0; _l < level; _l++) {

        _output += ">";

    }

    _output += object._id;

    // window.console.log(object);
    // window.console.log(_output);

    if (object._children.length > 0) {

        // loop through the children
        var _children = object._children;
        var _numberOfChildren = _children.length;
        var _c = 0;

        for (_c = 0; _c < _numberOfChildren; _c++) {

            this.generateTree_(_children[_c], level + 1);

        }

    }

};


/**
 * (Re-)render all associated displayable objects of this renderer. This method
 * clears the viewport and re-draws everything by looping through the tree of
 * objects. The current camera is used to setup the world space.
 *
 * @public
 */
DVT.renderer.prototype.render = function() {

    if (!this._canvas || !this._context) {

        throw new Error('The renderer was not initialized properly.');

    }

    // READY CHECK
    //
    // now we check if we are ready to display everything
    // - ready means: all textures loaded and setup, all external files loaded and
    // setup and all other objects loaded and setup
    //
    // if we are not ready, we wait..
    // if we are ready, we continue with the rendering
    // let's check if render() was called before and the single-shot timer is
    // already there
    // f.e., if we are in a setInterval-configured render loop, we do not want to
    // create multiple single-shot timers
    if (goog.isDefAndNotNull(this._readyCheckTimer)) {

        return;

    }

    //
    // LOADING..
    //
    if (!this._loader.completed()) {

        // we are not ready yet.. the loader is still working;

        this.showProgressBar_();

        // also reset the loadingCompleted flags
        this._loadingCompleted = false;
        this._onShowtime = false;

        // let's check again in a short time
        this._readyCheckTimer = goog.Timer.callOnce(function() {

            this._readyCheckTimer = null; // destroy the timer

            // try to render now..
            // if the loader is ready it will work, else wise another single-shot gets
            // configured in 500 ms
            this.render();

        }.bind(this), 100); // check again in 500 ms

        // intermediate rendering means render also
        // while loading is still active
        if (!this._config['INTERMEDIATE_RENDERING']) {

            return; // .. and jump out

        }

    } else {
        // we are ready! yahoooo!

        // call the onShowtime function which can be overloaded

        // we need two flags here since the render loop repeats so fast
        // that there would be timing issues
        if (!this._loadingCompleted && !this._onShowtime) {

            this._onShowtime = true;
            eval("this.onShowtime()");
            this._loadingCompleted = true; // flag the renderer as 'initial
            // loading completed'

        }

        // if we have a progress bar
        if (this._progressBar) {

            // this means the DVT.loader is done..
            this.hideProgressBar_();

            // .. we exit here since the hiding takes some time and automatically
            // triggers the rendering when done
            return;

        }

    }
    //
    // END OF LOADING
    //

    //
    // CURTAIN UP! LET THE SHOW BEGIN..
    //

    // this starts the rendering loops and store its id
    //this._AnimationFrameID = window.requestAnimationFrame(this.render.bind(this));
    eval("this.onRender()");
    this.render_(false, true);
    eval("this.afterRender()");

};


/**
 * Overload this function to execute code after all initial loading (files,
 * textures..) has completed and just before the first real rendering call.
 *
 * @public
 */
DVT.renderer.prototype.onShowtime = function() {

    // do nothing
};


/**
 * Overload this function to execute code on each rendering call.
 *
 * @public
 */
DVT.renderer.prototype.onRender = function() {

    // do nothing
};


/**
 * Overload this function to execute code after each rendering completed.
 *
 * @public
 */
DVT.renderer.prototype.afterRender = function() {

    // do nothing
};

/**
 * Internal function to perform the actual rendering by looping through all
 * associated DVT.objects.
 *
 * @param {boolean} picking If TRUE, perform picking - if FALSE render to the
 *          canvas viewport.
 * @param {?boolean=} invoked If TRUE, the render counts as invoked and f.e.
 *          statistics are generated.
 * @throws {Error} If anything goes wrong.
 * @protected
 */
DVT.renderer.prototype.render_ = function(picking, invoked) {



};


/**
 * Destroy this renderer.
 *
 * @public
 */
DVT.renderer.prototype.destroy = function() {

    // disconnect events listeners
    goog.events.removeAll(this);
    goog.events.unlisten(window, goog.events.EventType.RESIZE, this.onResize_,
        false, this);

    // stop the rendering loop
    window.cancelAnimationFrame(this._AnimationFrameID);

    // delete the loader if any
    if (this._loader) {
        delete this._loader;
        this._loader = null;
    }

    // remove the progress bar if any
    if (this._progressBar) {
        this._progressBar.kill();
        delete this._progressBar;
        this._progressBar = null;
    }

    // remove all objects
    this._objects.clear();
    delete this._objects;
    this._topLevelObjects.length = 0;
    delete this._topLevelObjects;

    // remove loader, camera and interactor
    delete this._loader;
    this._loader = null;

    delete this._camera;
    this._camera = null;

    delete this._interactor;
    this._interactor = null;

    // remove the rendering context
    delete this._context;
    this._context = null;

    // remove the canvas from the dom tree
    goog.dom.removeNode(this._canvas);
    delete this._canvas;
    this._canvas = null;

};