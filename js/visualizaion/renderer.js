/**
 * Created by shusa_000 on 6/29/2015.
 */




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
goog.require('goog.events');
//goog.require('DVT.progressbar');
//goog.require('goog.Timer');

/**
 * The superclass for all renderers.
 *
 * @constructor
 * @extends DVT.base
 */
DVT.renderer = function(){

    goog.base(this);

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
     * array containing all renderable objects
     * @type {Array}
     * @private
     */
    this._objects = [];

    /**
     * array containing all renderable objects with no parents
     * @type {Array}
     * @private
     */
    this._topLevelObjects = [];

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


};
// inherit from DVT.base
goog.inherits(DVT.renderer, DVT.base);









/**
 * Resizes the control to fit the size of the container.
 */
DVT.renderer.prototype.resize = function() {console.count('renderer.resize');

    // grab the new width and height of the container
    var container = goog.dom.getElement(this._container), canvas = goog.dom.getElement(this._canvas);
    this._width = container.clientWidth;
    this._height = container.clientHeight;

    // propagate it to the canvas
    canvas.width = this._width;
    canvas.height = this._height;

    if (this._classname === 'renderer3D') {

        // modify 3d viewport
        this._context.viewport(0, 0, this._width, this._height);

        // modify perspective
        this._camera._perspective = DVT.matriDVT.makePerspective(DVT.matriDVT.identity(), this._camera._fieldOfView, (this._canvas.width/this._canvas.height), 1, 10000);

    }

    // .. and re-draw
    //this.resetViewAndRender();

};




/**
 * Get the camera of this renderer. The camera is null until this renderer is
 * initialized.
 *
 * @return {?DVT.camera} The camera.
 */
DVT.renderer.prototype.__defineGetter__('camera', function() {console.count('renderer.getCam');

    return this._camera;

});



/**
 * Get the container of this renderer.
 *
 * @return {!Element|HTMLBodyElement} The container of this renderer.
 * @public
 */
DVT.renderer.prototype.__defineGetter__('container', function() {console.count('renderer.getContainer');

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
DVT.renderer.prototype.__defineSetter__('container', function(container) {console.count('setContainer');

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
 * Create the canvas of this renderer inside the configured container and using
 * attributes like width, height etc. Then, initialize the rendering context and
 * attach all necessary objects (e.g. camera, shaders..). Finally, initialize
 * the event listeners.
 *
 * @param {string} _contextName The name of the context to create.
 * @throws {Error} An exception if there were problems during initialization.
 * @protected
 */
DVT.renderer.prototype.init = function(_contextName) {console.count('renderer.init');

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
DVT.renderer.prototype.add = function(object) {console.count('renderer.add');

    // we know that objects which are directly added using this function are def.
    // top-level objects, meaning that they do not have a parent
    this._topLevelObjects.push(object);

    //attach listener to object
    goog.events.listen(object, 'PROCESSED',function(e){this.update_(e.target);},false,this);

    this.update_(object);

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
DVT.renderer.prototype.update_ = function(object) {console.count('renderer.update_');
    if (!this._canvas || !this._context) {

        throw new Error('The renderer was not initialized properly.');

    }

    if (!goog.isDefAndNotNull(object)) {
        //window.console.log(object);
        //window.console.log('Illegal object');
        throw new Error('Illegal object.');

    }
    else {


    }

};


/**
 * Get the existing DVT.object with the given id.
 *
 * @param {!DVT.object} object The object to search for
 * @return {?DVT.object} The requested DVT.object or null if it was not found.
 * @throws {Error} If the given object was invalid.
 * @public
 */
DVT.renderer.prototype.get = function(object) {console.count('renderer.get');

    if (!goog.isDefAndNotNull(object)) {

        throw new Error('Invalid object');

    }

    // loop through objects and try to find the id
    var _objects = this._objects;
    var _numberOfObjects = _objects.length;

    var _k = 0;
    for (_k = 0; _k < _numberOfObjects; _k++) {

        if (_objects[_k] == object) {

            // found!
            return _objects[_k];

        }

    }

    // not found
    return null;

};




/**
 * (Re-)render all associated displayable objects of this renderer. This method
 * clears the viewport and re-draws everything by looping through the tree of
 * objects. The current camera is used to setup the world space.
 *
 * @public
 */
DVT.renderer.prototype.render = function() {console.count('renderer.render');
    if (!this._canvas || !this._context) {

        throw new Error('The renderer was not initialized properly.');

    }

    eval("this.onRender()");
    this.render_(false, true);
    eval("this.afterRender()");

};


/**
 * Overload this function to execute code on each rendering call.
 *
 * @public
 */
DVT.renderer.prototype.onRender = function() {console.count('renderer.onRender');

    // do nothing
};


/**
 * Overload this function to execute code after each rendering completed.
 *
 * @public
 */
DVT.renderer.prototype.afterRender = function() {console.count('renderer.afterRender');

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
DVT.renderer.prototype.render_ = function(picking, invoked) {console.count('renderer.render_');



};
