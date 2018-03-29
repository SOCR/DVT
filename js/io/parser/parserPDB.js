/**
 * Created by shusa_000 on 10/2/2015.
 */

// provides
goog.provide('DVT.parserPDB');

// requires
goog.require('DVT.parser');
goog.require('THREE');
goog.require('THREE.PDBUtil');

/**
 * Create a parser for the binary freesurfer meshes
 *
 * @constructor
 * @extends DVT.parser
 */
DVT.parserPDB = function() {

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
goog.inherits(DVT.parserPDB, DVT.parser);

/**
 * @inheritDoc
 */
DVT.parserPDB.prototype.parse = function(object, data, loader) {

    this.holdObject = object;
    var THREELoader = new THREE.PDBLoader();
    this._data = data;
    THREELoader.createModel(THREELoader.parsePDB(data), this.genObject.bind(this));
    return;
};

/**
 * Creates THREE mesh based on parsed data
 * @param molecules Geometry holding molecule positions
 * @param bonds Geometry holding bond positions
 */
DVT.parserPDB.prototype.genObject = function (molecules, bonds) {
    var boxGeometry = new THREE.BoxGeometry(.02,.02,.4);
    var sphereGeometry = new THREE.IcosahedronGeometry(.5, 2 );
    var offset = molecules.center();
    for(var j = 0; j < bonds.vertices.length; j++) {
        bonds.vertices[j].x += offset.x;
        bonds.vertices[j].y += offset.y;
        bonds.vertices[j].z += offset.z;
    }
    var root = new THREE.Object3D();

    for ( var i = 0; i < molecules.vertices.length; i ++ ) {

        var position = molecules.vertices[ i ];
        var color = molecules.colors[ i ];

        var material = new THREE.MeshPhongMaterial( { color: color } );

        var moleculeObject = new THREE.Mesh( sphereGeometry, material );
        moleculeObject.position.copy( position );
        root.add( moleculeObject);


    }

    for ( var i = 0; i < bonds.vertices.length; i += 2 ) {

        var start = bonds.vertices[ i ];
        var end = bonds.vertices[ i + 1 ];

        var bondObject = new THREE.Mesh( boxGeometry, new THREE.MeshNormalMaterial( 0xffffff ) );
        bondObject.position.copy( start );
        bondObject.position.lerp( end, 0.5 );
        bondObject.scale.set( 5, 5, start.distanceTo( end ) );
        bondObject.lookAt( end );
        root.add( bondObject);

    }
    var object = this.holdObject;
    object.THREEContainer = root;
    object.THREEContainer.visible = object._meshVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});
};

// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserPDB', DVT.parserPDB);
goog.exportSymbol('DVT.parserPDB.prototype.parse', DVT.parserPDB.prototype.parse);
