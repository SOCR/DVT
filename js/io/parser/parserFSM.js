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

    object._pointIndices = [];
    var ind = object._pointIndices;

    // Go through two newlines
    var iters = 0;
    var curChar;
    do {
        curChar = this.scan('uchar');
        iters++;
    } while ((iters < 200) && (curChar != 0x0A))

    // Read one more newline
    curChar = this.scan('uchar');

    // get the number of vertices
    var numberOfVertices = this.scan('uint');

    // get the number of triangles
    var numberOfTriangles = this.scan('uint');

    // parse the vertex coordinates and store them in an array
    // x1,y1,z1,x2,y2,z2...
    var _vertices = this.scan('float', numberOfVertices * 3);

    // parse the triangle indices
    var _indices = this.scan('uint', numberOfTriangles * 3);

    // we count the appearance of indices to be able to average the normals
    var indexCounter = new Uint32Array(numberOfVertices);

    // buffer the normals since we need to calculate them in a second loop
    var normals = new Float32Array(numberOfTriangles * 9);

    object._points = p = new DVT.triplets(numberOfTriangles*9);
    object._normals = n = new DVT.triplets(numberOfTriangles*9);

    var geometry = new THREE.Geometry();
    // first loop through the indices
    var t;
    for (t = 0; t < numberOfTriangles; t++) {

        var i = t * 3;

        // grab the three indices which define a triangle
        var index1 = _indices[i];
        var index2 = _indices[i + 1];
        var index3 = _indices[i + 2];

        // store the ordered vertex indices
        ind.push(index1);
        ind.push(index2);
        ind.push(index3);

        // count the use of the indices
        indexCounter[index1] += 1;
        indexCounter[index2] += 1;
        indexCounter[index3] += 1;

        // grab the 3 corresponding vertices with each x,y,z coordinates
        var _index1 = index1 * 3;
        var _index2 = index2 * 3;
        var _index3 = index3 * 3;
        var v1x = _vertices[_index1];
        var v1y = _vertices[_index1 + 1];
        var v1z = _vertices[_index1 + 2];
        var v2x = _vertices[_index2];
        var v2y = _vertices[_index2 + 1];
        var v2z = _vertices[_index2 + 2];
        var v3x = _vertices[_index3];
        var v3y = _vertices[_index3 + 1];
        var v3z = _vertices[_index3 + 2];

        // add the points
        p.add(v1x, v1y, v1z);
        p.add(v2x, v2y, v2z);
        p.add(v3x, v3y, v3z);

        //
        // compute the normals
        var v1v = new goog.math.Vec3(v1x, v1y, v1z);
        var v2v = new goog.math.Vec3(v2x, v2y, v2z);
        var v3v = new goog.math.Vec3(v3x, v3y, v3z);

        var n1 = v2v.clone().subtract(v1v);
        var n2 = v3v.clone().subtract(v1v);

        var normal = goog.math.Vec3.cross(n1, n2).normalize();

        // store them
        normals[_index1] += normal.x;
        normals[_index1 + 1] += normal.y;
        normals[_index1 + 2] += normal.z;
        normals[_index2] += normal.x;
        normals[_index2 + 1] += normal.y;
        normals[_index2 + 2] += normal.z;
        normals[_index3] += normal.x;
        normals[_index3 + 1] += normal.y;
        normals[_index3 + 2] += normal.z;

    }

    // second loop through the indices
    // this loop is required since we need to average the normals and only now
    // know how often an index was used
    for (t = 0; t < numberOfTriangles; t++) {

        var i = t * 3;

        // grab the three indices which define a triangle
        var index1 = _indices[i];
        var index2 = _indices[i + 1];
        var index3 = _indices[i + 2];

        // grab the normals for this triangle
        var _index1 = index1 * 3;
        var _index2 = index2 * 3;
        var _index3 = index3 * 3;

        var n1x = normals[_index1];
        var n1y = normals[_index1 + 1];
        var n1z = normals[_index1 + 2];

        var n2x = normals[_index2];
        var n2y = normals[_index2 + 1];
        var n2z = normals[_index2 + 2];

        var n3x = normals[_index3];
        var n3y = normals[_index3 + 1];
        var n3z = normals[_index3 + 2];

        // convert the normals to vectors
        var n1v = new goog.math.Vec3(n1x, n1y, n1z);
        var n2v = new goog.math.Vec3(n2x, n2y, n2z);
        var n3v = new goog.math.Vec3(n3x, n3y, n3z);

        // transform triangle normals to vertex normals
        var normal1 = n1v.scale(1 / indexCounter[index1]).normalize();
        var normal2 = n2v.scale(1 / indexCounter[index2]).normalize();
        var normal3 = n3v.scale(1 / indexCounter[index3]).normalize();

        // .. add'em
        n.add(normal1.x, normal1.y, normal1.z);
        n.add(normal2.x, normal2.y, normal2.z);
        n.add(normal3.x, normal3.y, normal3.z);

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

        object._transform.translateX(parseFloat(_cras[0]));
        object._transform.translateY(parseFloat(_cras[1]));
        object._transform.translateZ(parseFloat(_cras[2]));

    }



    // .. and set the objectType to triangles
    object._type = DVT.displayable.types.TRIANGLES;

    DVT.TIMERSTOP(this._classname + '.parse');

    // the object should be set up here, so let's fire a modified event
    var modifiedEvent = new DVT.event.ModifiedEvent();
    modifiedEvent._object = object;
    modifiedEvent._container = container;
    this.dispatchEvent(modifiedEvent);

};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserFSM', DVT.parserFSM);
goog.exportSymbol('DVT.parserFSM.prototype.parse', DVT.parserFSM.prototype.parse);
