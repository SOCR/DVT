/**
 * Created by shusa_000 on 9/21/2015.
 */

// provides
goog.provide('DVT.parserSTL');

// requires
goog.require('DVT.parser');
goog.require('THREE');

/**
 * Create a parser for the .STL format. ASCII or binary format is supported.
 *
 * @constructor
 * @extends DVT.parser
 */
DVT.parserSTL = function() {

    //
    // call the standard constructor of DVT.base
    goog.base(this);

};
// inherit from DVT.parser
goog.inherits(DVT.parserSTL, DVT.parser);


/**
 * @inheritDoc
 */
DVT.parserSTL.prototype.parse = function(object, data, loader) {

    this._data = data;

    var geometry = new THREE.Geometry();

    // parse 5 bytes
    var _ascii_tag = this.parseChars(this.scan('uchar', 5));

    // check if this is an ascii STL file or a binary one
    if (_ascii_tag == 'solid') {

        // this is an ascii STL file
        this.parseASCII(geometry, this.scan('uchar', data.byteLength - 5));

    } else {

        // this is a binary STL file
        // (http://en.wikipedia.org/wiki/STL_(file_format))

        // A binary STL file has an 80 character header (which is generally
        // ignored, but which should never begin with 'solid' because that will
        // lead most software to assume that this is an ASCII STL file).
        //
        // but we ignore it
        this.jumpTo(80);

        var _triangleCount = this.scan('uint');


        // parse the bytes
        this.parseBIN(geometry, _triangleCount);

    }

    geometry.computeFaceNormals();
    object.THREEContainer = new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({color:0xf043a0, wireframe: true}));
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});

};


/**
 * Parses ASCII .STL data and modifies the given DVT.triplets containers.
 *
 * @param {!DVT.triplets} p The object's points as a DVT.triplets container.
 * @param {!DVT.triplets} n The object's normals as a DVT.triplets container.
 * @param {!Uint8Array} data The data to parse.
 * @protected
 */
DVT.parserSTL.prototype.parseASCII = function(geometry, data) {
    var _length = data.length;

    //
    // the mode flags

    // TRUE if the next couple of bytes are normals
    var _normalsMode = false;

    // TRUE if the next couple of bytes are vertices
    var _vertexMode = false;

    // store the beginning of a byte range
    var _rangeStart = 0;

    var i;
    for (i = 0; i < _length; i++) {

        if (data[i] == 10) {

            // the current byte is a line break

            if (_normalsMode || _vertexMode) {

                // grab the bytes which contain the numbers
                var _substring = this.parseChars(data, _rangeStart, i);

                // split the substring
                var _numbers = _substring.split(' ');

                // grab the x, y, z coordinates
                var x = parseFloat(_numbers[0]);
                var y = parseFloat(_numbers[1]);
                var z = parseFloat(_numbers[2]);

                if (_normalsMode) {
                    // add the normals 3x (for each vertex)
                } else {
                    // add the vertices
                    geometry.vertices.push(new THREE.Vector3(x,y,z));
                }

                // reset the modes
                _normalsMode = false;
                _vertexMode = false;

            }

        } else if (data[i - 1] == 32) {

            // the one byte before was a space

            if (data[i] == 102) {

                // this is a facet since the current char f

                // move pointer to the normals
                i += 13;
                _rangeStart = i;
                _normalsMode = true;

            } else if (data[i] == 118) {

                // this is a vertex since the current char v

                // move pointer to the coordinates
                i += 7;
                _rangeStart = i;
                _vertexMode = true;

            }

        }

    }

};


/**
 * Parses BINARY .STL data and modifies the given DVT.triplets containers.
 * Original embodiment by Matthew Goodman (meawoppl@gmail.com)
 *
 * @param {!DVT.triplets} p The object's points as a DVT.triplets container.
 * @param {!DVT.triplets} n The object's normals as a DVT.triplets container.
 * @param {!number} triangleCount The number of triangles.
 */
DVT.parserSTL.prototype.parseBIN = function(geometry, triangleCount) {
    console.log('BINBIN')

    var i = 0;
    for (i = 0; i < triangleCount; i++) {

        // grab 12 float values
        var _bytes = this.scan('float', 12);


        // now the vertices
        geometry.vertices.push(new THREE.Vector3(_bytes[3], _bytes[4], _bytes[5]));
        geometry.vertices.push(new THREE.Vector3(_bytes[6], _bytes[7], _bytes[8]));
        geometry.vertices.push(new THREE.Vector3(_bytes[9], _bytes[10], _bytes[11]));
        geometry.faces.push(new THREE.Face3( i * 3, i * 3 + 1, i * 3+2));
        // jump 2 bytes
        this._dataPointer += 2;

    }

};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserSTL', DVT.parserSTL);
goog.exportSymbol('DVT.parserSTL.prototype.parse', DVT.parserSTL.prototype.parse);
