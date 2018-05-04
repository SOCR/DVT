
//adapted from the XTK parser @https://github.com/xtk/X

// provides
goog.provide('DVT.parserOFF');

// requires
goog.require('DVT.parser');
goog.require('THREE');

/**
 * Create a parser for the .OFF format.
 * 
 * @constructor
 * @extends DVT.parser
 */
DVT.parserOFF = function() {

    //
    // call the standard constructor of DVT.base
    goog.base(this);


};
// inherit from DVT.parser
goog.inherits(DVT.parserOFF, DVT.parser);





/**
 * @inheritDoc
 */
DVT.parserOFF.prototype.parse = function( object, data, loader) {
 var readLine = function(){
    if (_position === _length) {
        throw new Error("End of file reached unexpectedly.")
    }
    for (var i = _position; i < _length; ++i) {
        if (byteData[i] === 10) { // line break
            
            var line = _self.parseChars(byteData, _position, i);
            _position = i + 1;
            return line;
        }
    }
    _position = _length;
    return _self.parseChars(byteData, _position, _length - 1);
}

    this._data = data;
    var _length = data.byteLength;
    var byteData = this.scan('uchar', _length);

    // allocate memory using a good guess
    var _pts = [];
    var geometry = new THREE.Geometry();

    var _position = 0;
    var _self = this;

    var _firstLine = readLine();
    var _numbersLine = _firstLine === "OFF" ? readLine() : _firstLine;
    var _split = _numbersLine.split(' ');
    var _nVertices = _split[0];
    var _nFaces = _split[1];

    while (_nVertices--) {
        var line = readLine();
        var coords = line.split(' ');
        // grab the x, y, z coordinates
        var x = parseFloat(coords[0]);
        var y = parseFloat(coords[1]);
        var z = parseFloat(coords[2]);
        geometry.vertices.push(new THREE.Vector3((x-770)*10, (y-700)*10, z*10));
    }

    while (_nFaces--) {
        var line = readLine();
        var coords = line.split(' ');
        geometry.faces.push(new THREE.Face3(parseInt(coords[1], 10), parseInt(coords[2], 10), parseInt(coords[3], 10)));

    }
console.log(geometry)
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.mergeVertices();
    geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    object.THREEContainer = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({color:Math.random()*0xffffff, wireframe: false, opacity:Math.random(), transparent:true}));
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});


};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserOFF', DVT.parserOFF);
goog.exportSymbol('DVT.parserOFF.prototype.parse', DVT.parserOFF.prototype.parse);