/**
 * Created by shusa_000 on 6/29/2015.
 */
goog.provide('DVT.renderer3D');

// requires
/*
 goog.require('DVT.buffer');
 goog.require('DVT.caption');
 goog.require('DVT.matrix');
 goog.require('DVT.shaders');
 goog.require('DVT.triplets');
 goog.require('DVT.vector');
 goog.require('goog.structs.Map');
 goog.require('goog.style');
 */
goog.require('DVT.renderer');
goog.require('THREE');
goog.require('orbitControls');


//TODO remove after speed optimizations
$(function () {
    ROTATEVECTOR = new THREE.Vector3(0,1,1);
    ROTATEAMOUNT = .005;
    ROTATECALLS = 1000;
    TOTALTIMES=[];
    RENDERTIMES=[];
    ROTATETIMES=[];

});

/**
 * Create a 3D renderer inside a given DOM Element.
 *
 * @constructor
 * @extends DVT.renderer
 */
DVT.renderer3D = function() {

    //
    // call the standard constructor of DVT.renderer
    goog.base(this);

    //
    // class attributes

    /**
     * @inheritDoc
     * @const
     */
    this._classname = 'renderer3D';

    /**
     * The camera object used by Three.js
     *
     * @type {?Object}
     * @protected
     */
    this._camera = null;

    /**
     * Allows far pan, zoom, scroll, etc
     * @type {THREE.OrbitControls}
     * @private
     */
    this._controller = null;

    /**
     * The scene object used by Three.js
     *
     * @type {?Object}
     * @protected
     */
    this._scene = null;

    /**
     * The background color.
     *
     * @type {!Array}
     * @protected
     */
    this._bgColor = [0, 0, 0];

    /**
     * The THREE.js rendering module
     *
     * @type {?Object}
     * @protected
     */

    this._renderer =null

    /**
     * switch for speed slowdown in animations
     * @type {boolean}
     * @private
     */
    this._animateFrame = false;
};
// inherit from DVT.renderer
goog.inherits(DVT.renderer3D, DVT.renderer);


/**
 * Access the configuration of this renderer. Possible settings and there
 * default values are:
 *
 * <pre>
 *  config.PROGRESSBAR_ENABLED: true
 *  config.PICKING_ENABLED: true
 *  config.ORDERING_ENABLED: true
 *  config.STATISTICS_ENABLED: false
 *  config.INTERMEDIATE_RENDERING: false
 * </pre>
 *
 * @return {Object} The configuration.
 */

DVT.renderer3D.prototype.__defineGetter__('config', function() {//console.count('renderer3D.getConfig');

    return this._config;

});





DVT.renderer3D.prototype.animate = function () {
    window.requestAnimationFrame(this.animate.bind(this));
    if(this._animateFrame)
        this.render_(true,true);
    this._animateFrame = !this._animateFrame;

};

DVT.renderer3D.prototype.control = function () {
    window.requestAnimationFrame(this.control.bind(this));
    this._controller.update();

};

/**
 * @inheritDoc
 */
DVT.renderer3D.prototype.init = function() {//console.count('renderer3D.init');

    // call the superclass' init method
    goog.base(this, 'init', "experimental-webgl");

    //configure camera
    this._camera = new THREE.PerspectiveCamera( 45, this._width / this._height, 1, 4000 );
    this._camera.position.z = 500;

    //setup controller
    this._controller = new THREE.OrbitControls(this._camera);

    this._controller.damping = 0.2;
    this._controller.addEventListener( 'change', this.render_.bind(this, false, true));
    //configure canvas opacity to reflect background color of container
    this._context.clearColor(this._bgColor[0], this._bgColor[1], this._bgColor[2], 0.0);

    //setup scene
    this._scene = new THREE.Scene();

    //add camera to scene
    this._scene.add(this._camera);

    this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, alpha : true} );
    this._renderer.setSize(this._width, this._height);


    this.animate();
    /*  //
     // Step2: Configure the context
     //
     try {



     // .. and depth test
     this._context.enable(this._context.DEPTH_TEST);
     // .. with perspective rendering
     this._context.depthFunc(this._context.LEQUAL);
     //




     if (this._config['PICKING_ENABLED']) {
     //
     // create a frame buffer for the picking functionality
     //
     // inspired by JAX https://github.com/sinisterchipmunk/jax/ and
     // http://dl.dropboDVT.com/u/5095342/WebGL/webgldemo3.js
     //
     // we basically render into an invisible framebuffer and use a unique
     // object
     // color to check which object is where (a simulated Z buffer since we can
     // not directly access the one from WebGL)
     var pickFrameBuffer = this._context.createFramebuffer();
     var pickRenderBuffer = this._context.createRenderbuffer();
     var pickTexture = this._context.createTexture();

     this._context.bindTexture(this._context.TEXTURE_2D, pickTexture);

     this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGB,
     this._width, this._height, 0, this._context.RGB,
     this._context.UNSIGNED_BYTE, null);

     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_WRAP_S, this._context.CLAMP_TO_EDGE);
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_WRAP_T, this._context.CLAMP_TO_EDGE);

     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MAG_FILTER, this._context.NEAREST);
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MIN_FILTER, this._context.NEAREST);

     this._context.bindFramebuffer(this._context.FRAMEBUFFER, pickFrameBuffer);
     this._context.bindRenderbuffer(this._context.RENDERBUFFER,
     pickRenderBuffer);
     this._context.renderbufferStorage(this._context.RENDERBUFFER,
     this._context.DEPTH_COMPONENT16, this._width, this._height);
     this._context.bindRenderbuffer(this._context.RENDERBUFFER, null);

     this._context.framebufferTexture2D(this._context.FRAMEBUFFER,
     this._context.COLOR_ATTACHMENT0, this._context.TEXTURE_2D,
     pickTexture, 0);
     this._context.framebufferRenderbuffer(this._context.FRAMEBUFFER,
     this._context.DEPTH_ATTACHMENT, this._context.RENDERBUFFER,
     pickRenderBuffer);
     this._context.bindFramebuffer(this._context.FRAMEBUFFER, null);

     this._pickFrameBuffer = pickFrameBuffer;

     }

     } catch (e) {

     // this exception indicates if the browser supports WebGL
     throw new Error('Exception while accessing GL Context!\n' + e);

     }

     */
};



/**
 * @inheritDoc
 */
DVT.renderer3D.prototype.update_ = function(object) {//console.count('renderer3D.update_');o
    console.log('function call: update_ in renderer3D')
    // call the update_ method of the superclass
    goog.base(this, 'update_', object);

    // check if object already existed..
    var existed = false;

    if(!goog.isDefAndNotNull(object)){
        return;
    }
    if (this.get(object)) {
        // this means, we are updating
        existed = true;
    }
    console.log(this.get(object));
    var loaded = object._loaded;
    var locked = object._locked;

    /*
     var id = object._id;
     var points = object._points;
     var normals = object._normals;
     var colors = object._colors;
     var texture = object._texture;
     var transform = object._transform;
     var colortable = object._colortable;
     var labelmap = object._labelmap; // here we access directly since we do not
     // want to create one using the labelmap() singleton accessor
     var scalars = object._scalars; // same direct access policy

     //
     // LABEL MAP
     //
     if (goog.isDefAndNotNull(labelmap) && goog.isDefAndNotNull(labelmap._file) &&
     labelmap._file._dirty) {
     // a labelmap file is associated to this object and it is dirty..
     // background: we always want to parse label maps first

     // run the update_ function on the labelmap object
     this.update_(labelmap);

     // jump out
     return;

     }

     // check for a label map again
     // this case can happen whenever a label map was already parsed (maybe in a
     // different renderer) and does not need additional file loading but just the
     // gl texture setup
     if (goog.isDefAndNotNull(labelmap) && labelmap._dirty) {

     // run the update_ function on the labelmap object without jumping out
     this.update_(labelmap);

     }

     // here we check if additional loading is necessary
     // this would be the case if
     // a) the object has an external texture
     // b) the object is based on an external file (vtk, stl...)
     // in these cases, we do not directly update the object but activate the
     // DVT.loader to get the externals and then let it call the update method
     if (goog.isDefAndNotNull(colortable) &&
     goog.isDefAndNotNull(colortable._file) && colortable._file._dirty) {
     // a colortable file is associated to this object and it is dirty..

     // start loading
     this._loader.load(colortable, object);

     return;

     } else if (goog.isDefAndNotNull(texture) &&
     goog.isDefAndNotNull(texture._file) && texture._file._dirty) {
     // a texture file is associated to this object and it is dirty..

     // start loading..
     this._loader.load(texture, object);

     return;

     } else if (goog.isDefAndNotNull(file) && goog.isArray(file)) {
     // this object holds multiple files, a.k.a it is a DICOM series

     // check if we already loaded all the files
     if (!goog.isDefAndNotNull(object.MRI)) {

     // no files loaded at all, start the loading

     var _k = 0;
     var _len = file.length;
     for (_k = 0; _k < _len; _k++) {

     // start loading of each file..
     this._loader.load(file[_k], object);

     }

     return;

     } else if (object.MRI.loaded_files != file.length) {

     // still loading
     return;

     } else if (!object._dirty) {

     // already parsed the volume
     return;

     }

     // just continue

     }
     */

    //@@@ CHANGED FROM ELIF
    if (!loaded) {
        // this object is based on an external file and it is dirty..
        if (!locked) {
            console.log('Function call: update_ in renderer3D message: load ');
            // start loading..
            this._loader.load(object);
        }
        return;

    }/* else if (goog.isDefAndNotNull(scalars) &&
     goog.isDefAndNotNull(scalars._file) && scalars._file._dirty) {
     // a scalars container is associated to this object and it's associated file
     // is dirty

     // start loading
     this._loader.load(scalars, object);

     return;

     }

     // MULTI OBJECTS
     //
     // objects can have N child objects which again can have M child objects and
     // so on
     //
     // check if this object has children
     if (object._children.length > 0) {

     // loop through the children and recursively setup the object
     var children = object._children;
     var numberOfChildren = children.length;
     var c = 0;

     for (c = 0; c < numberOfChildren; c++) {

     this.update_(children[c]);

     }

     }

     // check if this is an empty object, if yes, jump out
     // empty objects can be used to group objects
     if (!points) {

     object._dirty = false;
     return;

     }


     // a simple locking mechanism to prevent multiple calls when using
     // asynchronous requests
     var counter = 0;
     while (this._locked) {

     // wait
     counter++;
     window.console.log('Possible thread lock avoided: ' + counter);

     }

     this._locked = true;

     //
     // LOCKED DOWN: ACTION!!
     //
     // This gets executed after all dynamic content has been loaded.

     // DVT.TIMER(this._classname + '.update');

     // check if this is an DVT.slice as part of a DVT.labelmap
     var isLabelMap = (object instanceof DVT.slice && object._volume instanceof DVT.labelmap);

     //
     // TEXTURE
     //

     if (existed && goog.isDefAndNotNull(texture) && texture._dirty) {

     // this means the object already existed and the texture is dirty
     // therefore, we delete the old gl buffers

     var oldTexturePositionBuffer = this._texturePositionBuffers.get(id);
     if (goog.isDefAndNotNull(oldTexturePositionBuffer)) {

     if (this._context.isBuffer(oldTexturePositionBuffer._glBuffer)) {

     this._context.deleteBuffer(oldTexturePositionBuffer._glBuffer);

     }

     }
     }

     var texturePositionBuffer = null;
     if (goog.isDefAndNotNull(texture)) {
     // texture associated to this object

     if (!existed || texture._dirty) {

     // the object either did not exist or the texture is dirty, so we
     // re-create the gl buffers

     var textureCoordinateMap = object._textureCoordinateMap;

     // check if we have a valid texture-to-object's-coordinate map
     if (!goog.isDefAndNotNull(textureCoordinateMap)) {

     var m = 'Can not add an object and texture ';
     m += 'without valid coordinate mapping! Set the textureCoordinateMap!';
     throw new Error(m);

     }

     var _flipY = false;
     if (texture._rawData) {
     // use the standard webgl flip Y
     _flipY = true;
     }

     this._context.pixelStorei(this._context.UNPACK_FLIP_Y_WEBGL, _flipY);

     // setup the glTexture, at this point the image for the texture was
     // already
     // loaded thanks to DVT.loader
     var glTexture = this._context.createTexture();

     // connect the image and the glTexture
     glTexture.image = texture._image;

     //
     // activate the texture on the WebGL side
     this._textures.set(texture._id, glTexture);

     this._context.bindTexture(this._context.TEXTURE_2D, glTexture);
     if (texture._rawData) {

     var _texture_type = this._context.RGBA;

     if (texture._grayscale) {

     // one channel texture
     _texture_type = this._context.LUMINANCE;
     this._context.pixelStorei(this._context.UNPACK_ALIGNMENT, 1);

     }

     // use rawData rather than loading an imagefile
     this._context.texImage2D(this._context.TEXTURE_2D, 0,
     _texture_type, texture._rawDataWidth, texture._rawDataHeight,
     0, _texture_type, this._context.UNSIGNED_BYTE,
     texture._rawData);

     } else {

     // use an imageFile for the texture
     this._context.texImage2D(this._context.TEXTURE_2D, 0,
     this._context.RGBA, this._context.RGBA,
     this._context.UNSIGNED_BYTE, glTexture.image);

     }

     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_WRAP_S, this._context.CLAMP_TO_EDGE);
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_WRAP_T, this._context.CLAMP_TO_EDGE);

     // for labelmaps, we use NEAREST NEIGHBOR filtering
     if (isLabelMap) {
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MAG_FILTER, this._context.NEAREST);
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MIN_FILTER, this._context.NEAREST);
     } else {
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MAG_FILTER, this._context.LINEAR);
     this._context.texParameteri(this._context.TEXTURE_2D,
     this._context.TEXTURE_MIN_FILTER, this._context.LINEAR);
     }

     // release the texture binding to clear things
     this._context.bindTexture(this._context.TEXTURE_2D, null);

     // create texture buffer
     var glTexturePositionBuffer = this._context.createBuffer();

     // bind and fill with colors defined above
     this._context.bindBuffer(this._context.ARRAY_BUFFER,
     glTexturePositionBuffer);
     this._context.bufferData(this._context.ARRAY_BUFFER, new Float32Array(
     textureCoordinateMap), this._context.STATIC_DRAW);

     // create an DVT.buffer to store the texture-coordinate map
     texturePositionBuffer = new DVT.buffer(glTexturePositionBuffer,
     textureCoordinateMap.length, 2);

     this._texturePositionBuffers.set(id, texturePositionBuffer);

     texture._dirty = false;

     } else {

     // the texture is not dirty and the object already existed, so use the old
     // buffer
     texturePositionBuffer = this._texturePositionBuffers.get(id);

     }

     // dirty check

     } // check if object has a texture

     this._loader.addProgress(0.1);

     //
     // SPECIAL CASE: LABELMAPS
     //

     // since we now have labelmap support, we process the textures (which is the
     // only essential of labelmaps) first and ..

     // .. jump out if this is part of a labelmap
     if (isLabelMap) {

     this._locked = false; // we gotta unlock here already

     DVT.TIMERSTOP(this._classname + '.update');

     this._loader.addProgress(0.9); // add the missing progress

     return; // sayonara

     // this prevents storing of not required buffers, objects etc. since the
     // labelmaps are only pseudo DVT.objects and never rendered directly but
     // merged into an DVT.volume

     }


     //
     // BOUNDING BOX
     //
     // The global bounding incorporates all individual bounding boxes of the
     // objects. This bounding box only changes if either the points or the
     // transform are dirty.
     if (!existed || points._dirty || transform._dirty) {
     var transformationMatrix = transform._matrix;

     var tMin = DVT.matriDVT.multiplyByVector(transformationMatrix, points._minA, points._minB, points._minC);
     var tMax = DVT.matriDVT.multiplyByVector(transformationMatrix, points._maxA, points._maxB, points._maxC);

     if (goog.isNull(this._minX) || tMin.x < this._minX) {
     this._minX = tMin.x;
     }
     if (goog.isNull(this._maxX) || tMaDVT.x > this._maxX) {
     this._maxX = tMaDVT.x;
     }
     if (goog.isNull(this._minY) || tMin.y < this._minY) {
     this._minY = tMin.y;
     }
     if (goog.isNull(this._maxY) || tMaDVT.y > this._maxY) {
     this._maxY = tMaDVT.y;
     }
     if (goog.isNull(this._minZ) || tMin.z < this._minZ) {
     this._minZ = tMin.z;
     }
     if (goog.isNull(this._maxZ) || tMaDVT.z > this._maxZ) {
     this._maxZ = tMaDVT.z;
     }
     // we always keep track of the current center position
     this._center = [(this._minX + this._maxX) / 2,
     (this._minY + this._maxY) / 2,
     (this._minZ + this._maxZ) / 2];

     // only set the transform clean since we still need to look at the points
     transform._dirty = false;
     }


     //
     // VERTICES
     //

     if (existed && points._dirty) {

     // this means the object already existed and the points are dirty
     // therefore, we delete the old gl buffers

     // remove old vertex buffer
     var oldVertexBuffer = this._vertexBuffers.get(id);
     if (goog.isDefAndNotNull(oldVertexBuffer)) {

     if (this._context.isBuffer(oldVertexBuffer._glBuffer)) {

     this._context.deleteBuffer(oldVertexBuffer._glBuffer);

     }

     }

     }

     var vertexBuffer = null;

     if (!existed || points._dirty) {

     // the object either did not exist or the points are dirty, so we re-create
     // the gl buffers and reset the bounding box

     var glVertexBuffer = this._context.createBuffer();

     // bind and fill with vertices of current object

     // resize the dynamic array
     points.resize();

     this._context.bindBuffer(this._context.ARRAY_BUFFER, glVertexBuffer);

     this._context.bufferData(this._context.ARRAY_BUFFER, points._triplets,
     this._context.STATIC_DRAW);

     // create an DVT.buffer to store the vertices
     // every vertex consists of 3 items (x,y,z)
     vertexBuffer = new DVT.buffer(glVertexBuffer, points.count, 3);

     points._dirty = false;

     } else {

     // the points are not dirty and the object already existed, so use the old
     // buffer
     vertexBuffer = this._vertexBuffers.get(id);

     }

     this._loader.addProgress(0.3);


     //
     // NORMALS
     //

     if (existed && normals._dirty) {

     // this means the object already existed and the points are dirty
     // therefore, we delete the old gl buffers

     // remove old normals buffer
     var oldNormalBuffer = this._vertexBuffers.get(id);
     if (goog.isDefAndNotNull(oldNormalBuffer)) {

     if (this._context.isBuffer(oldNormalBuffer._glBuffer)) {

     this._context.deleteBuffer(oldNormalBuffer._glBuffer);

     }

     }

     }

     var normalBuffer = null;

     if (!existed || normals._dirty) {

     // the object either did not exist or the normals are dirty, so we re-create
     // the gl buffers

     var glNormalBuffer = this._context.createBuffer();

     // bind and fill with normals of current object

     // resize the dynamic array
     normals.resize();

     this._context.bindBuffer(this._context.ARRAY_BUFFER, glNormalBuffer);
     this._context.bufferData(this._context.ARRAY_BUFFER, normals._triplets,
     this._context.STATIC_DRAW);

     // create an DVT.buffer to store the normals
     // every normal consists of 3 items (x,y,z)
     normalBuffer = new DVT.buffer(glNormalBuffer, normals.count, 3);

     normals._dirty = false;

     } else {

     // the normals are not dirty and the object already existed, so use the old
     // buffer
     normalBuffer = this._normalBuffers.get(id);

     }

     // update progress
     this._loader.addProgress(0.3);


     //
     // COLORS
     //
     // Objects can have point colors which can be different for each fragment.
     // If no point colors are defined, the object has a solid color.

     // also check if colors is null
     if (existed && colors && colors._dirty) {

     // this means the object already existed and the colors are dirty
     // therefore, we delete the old gl buffers

     var oldColorBuffer = this._colorBuffers.get(id);
     if (goog.isDefAndNotNull(oldColorBuffer)) {

     if (this._context.isBuffer(oldColorBuffer._glBuffer)) {

     this._context.deleteBuffer(oldColorBuffer._glBuffer);

     }

     }
     }

     // check if we have point colors, then we need to setup the glBuffer and the
     // DVT.buffer
     var colorBuffer = null;

     if (colors) {

     // yes, there are point colors setup

     if (!existed || colors._dirty) {

     // the object either did not exist or the colors are dirty, so we
     // re-create the gl buffers

     // check if the point colors are valid, note that we use the length for
     // this
     // check which is slightly faster!
     if (colors.length != points.length) {

     // mismatch, this can not work
     throw new Error('Mismatch between points and point colors.');

     }
     var glColorBuffer = this._context.createBuffer();

     // bind and fill with colors defined above

     // resize the dynamic array
     colors.resize();
     this._context.bindBuffer(this._context.ARRAY_BUFFER, glColorBuffer);
     this._context.bufferData(this._context.ARRAY_BUFFER, colors._triplets,
     this._context.STATIC_DRAW);

     // create an DVT.buffer to store the colors
     // every color consists of 3 items (r,g,b)
     colorBuffer = new DVT.buffer(glColorBuffer, colors.count, 3);

     colors._dirty = false;

     } else {

     // the colors are not dirty and the object already existed, so use the old
     // buffer
     colorBuffer = this._colorBuffers.get(id);

     }

     }

     this._loader.addProgress(0.2);


     //
     // SCALARS
     //
     // Objects can have scalars attached to each verteDVT.

     if (existed && scalars && scalars._dirty) {

     // this means the object already existed and the scalars are dirty
     // therefore, we delete the old gl buffers

     var oldScalarBuffer = this._scalarBuffers.get(id);
     if (goog.isDefAndNotNull(oldScalarBuffer)) {

     if (this._context.isBuffer(oldScalarBuffer._glBuffer)) {

     this._context.deleteBuffer(oldScalarBuffer._glBuffer);

     }

     }
     }

     // check if we have scalars, then we need to setup the glBuffer and the
     // DVT.buffer
     var scalarBuffer = null;

     if (scalars) {

     // yes, there are scalars setup
     var scalarsArray = scalars._glArray;

     if (!existed || scalars._dirty) {

     // the object either did not exist or the scalars are dirty, so we
     // re-create the gl buffers

     // check if the scalars are valid - we must match the number of vertices
     // here
     if (scalarsArray.length != points.length) {

     // mismatch, this can not work
     throw new Error('Mismatch between points and scalars.');

     }
     var glScalarBuffer = this._context.createBuffer();

     // bind and fill with colors defined above
     this._context.bindBuffer(this._context.ARRAY_BUFFER, glScalarBuffer);
     this._context.bufferData(this._context.ARRAY_BUFFER, scalarsArray,
     this._context.STATIC_DRAW);

     // create an DVT.buffer to store the colors
     // every scalar consists of 1 item
     scalarBuffer = new DVT.buffer(glScalarBuffer, scalarsArray.length, 3);

     scalars._dirty = false;

     } else {

     // the colors are not dirty and the object already existed, so use the old
     // buffer
     scalarBuffer = this._scalarBuffers.get(id);

     }

     }

     this._loader.addProgress(0.1);


     //
     // FINAL STEPS
     //
     */
    // add the object to the internal tree which reflects the rendering order
    // (based on opacity)
    if (!existed) {
        object.init(this._renderer);
        this._objects.push(object);
        this._scene.add(object.THREEContainer);
        object._loader.finishRender();
        this.render();

        //TODO remove after optimization tests are complete
        //this.rotate();
    }

};
DVT.renderer3D.prototype.rotate = function () {//console.count('renderer3D.rotate');
    //console.time('renderer3D.rotate');
    //console.time('renderer3D.rotate(rotateOnAxis)');
    STARTTOTAL= window.performance.now();
    if(ROTATECALLS > 0)requestAnimationFrame(this.rotate.bind(this));
    else{
        console.log('average(ROTATE): '+average(ROTATETIMES),'std dev(ROTATE): ' + standardDeviation(ROTATETIMES));
        console.log('average(RENDER): '+average(RENDERTIMES),'std dev(RENDER): ' + standardDeviation(RENDERTIMES));
        console.log('average(TOTAL): '+average(TOTALTIMES),'std dev(TOTAL): ' + standardDeviation(TOTALTIMES));
    }
    ROTATECALLS -= 1;
    this._objects[0].THREEContainer.rotateOnAxis(ROTATEVECTOR, ROTATEAMOUNT);
    ROTATETIMES.push(window.performance.now()-STARTTOTAL);
    STARTRENDER = window.performance.now();
    //console.timeEnd('renderer3D.rotate(rotateOnAxis)');
    //console.time('renderer3D.rotate(render)');
    this._renderer.render(this._scene, this._camera);
    //console.timeEnd('renderer3D.rotate(render)');
    //console.timeEnd('renderer3D.rotate');
    RENDERTIMES.push(window.performance.now()-STARTRENDER);
    TOTALTIMES.push(window.performance.now()-STARTTOTAL);


}



function standardDeviation(values){
    var avg = average(values);

    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}


/**
 * @inheritDoc
 */
DVT.renderer3D.prototype.render_ = function(picking, invoked) {//console.count('renderer3D.render_');


    // only proceed if there are actually objects to render
    var _objects = this._objects;
    var _numberOfObjects = _objects.length;
    if (_numberOfObjects == 0) {
        // there is nothing to render
        // get outta here
        return;
    }
    for(var j = 0; j < _numberOfObjects;j++) {
        _objects[j].animate();
    }
    this._renderer.render(this._scene, this._camera)

};



    /**
     * Get the background color.
     *
     * @return {!Array} The background color normalized.
     * @public
     */
    DVT.renderer3D.prototype.__defineGetter__('bgColor', function() {//console.count('renderer3D.getbg');

        return this._bgColor;

    });

    /**
     * Set the background color.
     *
     * @param {!Array}
     *          bgColor The background color normalized.
     * @public
     */
    DVT.renderer3D.prototype.__defineSetter__('bgColor', function(bgColor) {//console.count('renderer3D.setbg');

        this._bgColor = bgColor;

    });



// export symbols (required for advanced compilation)
    goog.exportSymbol('DVT.renderer3D', DVT.renderer3D);
    goog.exportSymbol('DVT.renderer3D.prototype.init', DVT.renderer3D.prototype.init);
    goog.exportSymbol('DVT.renderer3D.prototype.add', DVT.renderer3D.prototype.add);
    goog.exportSymbol('DVT.renderer3D.prototype.onShowtime',
        DVT.renderer3D.prototype.onShowtime);
    goog.exportSymbol('DVT.renderer3D.prototype.onRender',
        DVT.renderer3D.prototype.onRender);
    goog.exportSymbol('DVT.renderer3D.prototype.get', DVT.renderer3D.prototype.get);
    goog.exportSymbol('DVT.renderer3D.prototype.render',
        DVT.renderer3D.prototype.render);
    goog.exportSymbol('DVT.renderer3D.prototype.destroy',
        DVT.renderer3D.prototype.destroy);
    goog.exportSymbol('DVT.renderer3D.prototype.remove',
        DVT.renderer3D.prototype.remove);
    goog.exportSymbol('DVT.renderer3D.prototype.resetBoundingBox',
        DVT.renderer3D.prototype.resetBoundingBox);
    goog.exportSymbol('DVT.renderer3D.prototype.resetViewAndRender',
        DVT.renderer3D.prototype.resetViewAndRender);
    goog.exportSymbol('DVT.renderer3D.prototype.pick', DVT.renderer3D.prototype.pick);
    goog.exportSymbol('DVT.renderer3D.prototype.pick3d', DVT.renderer3D.prototype.pick3d);
    goog.exportSymbol('DVT.renderer3D.prototype.afterRender', DVT.renderer3D.prototype.afterRender);
    goog.exportSymbol('DVT.renderer3D.prototype.resize', DVT.renderer3D.prototype.resize);
