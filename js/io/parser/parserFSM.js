/**
 * Created by shusa_000 on 9/21/2015.
 */

// provides
goog.provide('DVT.parserFSM');

// requires
goog.require('DVT.parser');;
goog.require('THREE');

/**
 * Create a parser for the binary freesurfer meshes
 *
 * @constructor
 * @extends DVT.parser
 */
DVT.parserFSM = function() {

    //
    // call the standard constructor of DVT.parser
    goog.base(this);

    /**
     * Here, the data stream is big endian.
     *
     * @inheritDoc
     */
    this._littleEndian = false;

};
// inherit from DVT.parser
goog.inherits(DVT.parserFSM, DVT.parser);

/**
 * @inheritDoc
 */
DVT.parserFSM.prototype.parse = function(object, data, loader) {

    this._data = data;

    // Go through two newlines
    var iters = 0;
    var curChar;
    do {
        curChar = this.scan('uchar');
        iters++;
    } while ((iters < 200) && (curChar != 0x0A))

    // Read one more newline
    this.scan('uchar');

    // get the number of vertices
    var numberOfVertices = this.scan('uint');

    // get the number of triangles
    var numberOfTriangles = this.scan('uint');

    // parse the vertex coordinates and store them in an array
    // x1,y1,z1,x2,y2,z2...
    var _vertices = this.scan('float', numberOfVertices * 3);

    // parse the triangle indices
    var _indices = this.scan('uint', numberOfTriangles * 3);

    var geometry = new THREE.Geometry();
    var updateCheck = Math.ceil(numberOfTriangles / 20);

    // first loop through the indices
    var t;
    for (t = 0; t < numberOfTriangles; t++    ) {
        if (t % updateCheck === 0) {
            loader.updateParse(t / numberOfTriangles);
        }
        var i = t * 3;

        // grab and push the three indices which define a triangle
        var index1 = _indices[i];
        var index2 = _indices[i + 1];
        var index3 = _indices[i + 2];

        geometry.faces.push(new THREE.Face3( index1, index2, index3));

        // update points corresponding to indices, if necessary
        if (!geometry.vertices[index1]) {
            geometry.vertices[index1] = new THREE.Vector3(_vertices[index1 * 3], _vertices[index1 * 3 + 1], _vertices[index1 * 3 + 2]);
        }
        if (!geometry.vertices[index2]) {
            geometry.vertices[index2] = new THREE.Vector3(_vertices[index2 * 3], _vertices[index2 * 3 + 1], _vertices[index2 * 3 + 2]);
        }
        if (!geometry.vertices[index3]) {
            geometry.vertices[index3] = new THREE.Vector3(_vertices[index3 * 3], _vertices[index3 * 3 + 1], _vertices[index3 * 3 + 2]);
        }

    }

    var _rest_of_file = this.scan('uchar', this._data.byteLength-this._dataPointer);
    // find the cras field
    var _cras = null;
    for (var i=0; i<_rest_of_file.length;i++) {

        // c == 99
        // r == 114
        // a == 97
        // s == 115
        if (_rest_of_file[i] == 99 && _rest_of_file[i+1] == 114 && _rest_of_file[i+2] == 97 && _rest_of_file[i+3] == 115) {

            // start from 8 bytes until a linebreak or EOF
            var _cras_values_start = i+9;
            var _cras_values_stop = _cras_values_start;

            while(_rest_of_file[i] != 10 && i<_rest_of_file.length) {

                // part of cras
                _cras_values_stop++;

                // .. jump one byte
                i++;

            }

            _cras = this.parseChars(_rest_of_file.subarray(_cras_values_start, _cras_values_stop)).split(' ');

            break;

        }

    }

    if (_cras) {
        var transform = new THREE.Vector3(parseFloat(_cras[0]),parseFloat(_cras[1]),parseFloat(_cras[2]));
        for(var j = 0; j < geometry.vertices.length; j++) {
            if(geometry.vertices[j]) {
                geometry.vertices[j].add(transform);
            }
        }
    }

    //finish parsing
    geometry.computeFaceNormals();
    object.THREEContainer = new THREE.Mesh(geometry,new THREE.MeshPhongMaterial({color:0xf00ff0}));
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});

};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserFSM', DVT.parserFSM);
goog.exportSymbol('DVT.parserFSM.prototype.parse', DVT.parserFSM.prototype.parse);
