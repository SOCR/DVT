/**
 * Created by shusa_000 on 6/29/2015.
 */

goog.provide('DVT.parserTRK');

// requires
goog.require('DVT.parser');
goog.require('DVT.shader');
goog.require('THREE');



/**
 * Create a parser for the binary .TRK format.
 *
 * @constructor
 * @extends DVT.parser
 */
DVT.parserTRK = function() {

    //
    // call the standard constructor of DVT.base
    goog.base(this);

};
// inherit from DVT.parser
goog.inherits(DVT.parserTRK, DVT.parser);


/**
 * @inheritDoc
 */
DVT.parserTRK.prototype.parse = function(object, data, loader) {//console.count('parserTRK.parse');


    this._data = data;

    // parse the header of the .TRK file
    // Documented here: http://trackvis.org/docs/?subsect=fileformat
    var header = {

        'id_string': this.scan('uchar', 6),
        'dim': this.scan('ushort', 3),
        'voxel_size': this.scan('float', 3),
        'origin': this.scan('float', 3),
        'n_scalars': this.scan('ushort'),
        'scalar_name': this.scan('uchar', 200),
        'n_properties': this.scan('ushort'),
        'property_name': this.scan('uchar', 200),
        'vox_to_ras': this.scan('float', 16),
        'reserved': this.scan('uchar', 444),
        'voxel_order': this.scan('uchar', 4),
        'pad2': this.scan('uchar', 4),
        'image_orientation_patient': this.scan('float', 6),
        'pad1': this.scan('uchar', 2),
        'invert_x': this.scan('uchar'),
        'invert_y': this.scan('uchar'),
        'invert_z': this.scan('uchar'),
        'swap_xy': this.scan('uchar'),
        'swap_yz': this.scan('uchar'),
        'swap_zx': this.scan('uchar'),
        'n_count': this.scan('uint'),
        'version': this.scan('uint'),
        'hdr_size': this.scan('uint')
    };

    //
    // parse the data
    // if n_count not provided, we parse the data until end of points
    var numberOfFibers = (header.n_count === 0) ? Infinity : header.n_count;
    var numberOfScalars = header.n_scalars;

    var m = new THREE.Matrix4();
    var min = {x: Infinity, y: Infinity, z:Infinity};
    var max = {x: -Infinity, y: -Infinity, z: -Infinity};
    m.set(header.vox_to_ras[0],header.vox_to_ras[1], header.vox_to_ras[2], header.vox_to_ras[3], header.vox_to_ras[4], header.vox_to_ras[5], header.vox_to_ras[6], header.vox_to_ras[7], header.vox_to_ras[8], header.vox_to_ras[9], header.vox_to_ras[10], header.vox_to_ras[11], header.vox_to_ras[12], header.vox_to_ras[13], header.vox_to_ras[14], header.vox_to_ras[15]);

    var _numPoints = this.scan('uint', (this._data.byteLength - 1000) / 4);
    this.jumpTo(header.hdr_size);
    var _points = this.scan('float', (this._data.byteLength - 1000) / 4);

    var offset = 0;

    var i;
    var updateCheck = 0;
    if (numberOfFibers === Infinity) {
        updateCheck = 100000;
    } else {
        updateCheck = Math.ceil(numberOfFibers / 20);
    }

    var fiberPoints = new THREE.Geometry();
    var particlePoints = new THREE.Geometry();
    var mapArray = [], mapPoints = 0;


    for (i = 0; i < numberOfFibers; i++) {
        if (i % updateCheck === 0) {
            loader.updateParse(i / numberOfFibers);
        }
        // if undefined, it means we have parsed all the data
        // (useful if n_count not defined or === 0)
        if (typeof (_numPoints[offset]) === 'undefined'){
            numberOfFibers = i;
            break;
        }

        var numPoints = _numPoints[offset];


        // console.log(numPoints, offset);



        var length = 0.0;
        var oldPoint = 0;
        var particleArray = [], particleGeom = new THREE.Geometry();
        // loop through the points of this fiber
        for ( var j = 0; j < numPoints; j++) {

            // read coordinates
            var x = _points[offset + j * 3 + j * numberOfScalars + 1];
            var y = _points[offset + j * 3 + j * numberOfScalars + 2];
            var z = _points[offset + j * 3 + j * numberOfScalars + 3];

            // console.log(x, y, z);

            // read scalars
            // var scalars = this.scan('float', header.n_scalars);

            // Convert coordinates to world space by dividing by spacing
            x = x / header.voxel_size[0];
            y = y / header.voxel_size[1];
            z = -z / header.voxel_size[2];
            var vector=new THREE.Vector3( x,  y, z );
            vector.applyProjection(m);
            vector.x-= -0;
            vector.y-= 0;
            vector.z-= -0;
            vector.x*=1;
            vector.y*=1;
            vector.z*=1;
            if(vector.x<min.x)
                min.x=vector.x;
            if(vector.x>max.x)
                max.x=vector.x;
            if(vector.y<min.y)
                min.y=vector.y;
            if(vector.y>max.y)
                max.y=vector.y;
            if(vector.z<min.z)
                min.z=vector.z;
            if(vector.z>max.z)
                max.z=vector.z;
            fiberPoints.vertices.push(vector);
            particleArray.push(vector);

            // fiber length
            if (j > 0) {

                // if not the first point, calculate length

                var displacement=[Math.abs(vector.x - oldPoint.x), Math.abs(vector.y - oldPoint.y), Math.abs( vector.z- oldPoint.z)];
                var curLength = Math.sqrt(displacement[0]*displacement[0] +
                    displacement[1]*displacement[1] + displacement[2]*displacement[2]);
                length += curLength;
                //adds in vertex color values
                if(j==1) {
                    fiberPoints.colors.push(new THREE.Color(displacement[0] / curLength, displacement[1] / curLength, displacement[2] / curLength));
                }

                fiberPoints.colors.push( new THREE.Color( displacement[0]/curLength, displacement[1]/curLength, displacement[2]/curLength ));


                if(j < numPoints - 1)
                {
                    fiberPoints.colors.push( new THREE.Color( displacement[0]/curLength, displacement[1]/curLength, displacement[2]/curLength ));
                    fiberPoints.vertices.push(vector);
                }
            }
            oldPoint = vector;
        }

        var curve = new THREE.SplineCurve3(particleArray);
        var curveLength = curve.getLength();
        particleGeom = new THREE.Geometry();
        particleArray = curve.getSpacedPoints(curveLength / 60 * 60);
        oldPoint = particleArray[0];

        //calculate particle system Colors
        for( var j = 1; j < particleArray.length; j++)
        {
            vector = particleArray[j];
            displacement=[Math.abs(vector.x - oldPoint.x), Math.abs(vector.y - oldPoint.y), Math.abs( vector.z- oldPoint.z)];
            curLength = Math.sqrt(displacement[0]*displacement[0] + displacement[1]*displacement[1] + displacement[2]*displacement[2]);

            if(j==1) {
                particleGeom.colors.push(new THREE.Color(displacement[0] / curLength, displacement[1] / curLength, displacement[2] / curLength));
            }

            particleGeom.colors.push( new THREE.Color( displacement[0]/curLength, displacement[1]/curLength, displacement[2]/curLength ));

            oldPoint = vector;

        }
        particleGeom.vertices = particleArray;
        offset += numPoints * 3 + numPoints * numberOfScalars + 1;

        //populate map array (xyzw)
        for(var j = 0; j < particleArray.length; j++)
        {
            if(j % 80 == 0) {
                mapArray.push(particleArray[j].x);
                mapArray.push(particleArray[j].y);
                mapArray.push(particleArray[j].z);

                //index in all points
                mapArray.push(j + mapPoints);
            }

        }

        //insert rollback token
        particleGeom.vertices.push(new THREE.Vector3(999,999,999));
        particleGeom.vertices.push(new THREE.Vector3(particleGeom.vertices.length - 1, particleGeom.vertices.length - 1, particleGeom.vertices.length - 1));

        //pad color array to maintain 1:1 ratio with vertices
        particleGeom.colors.push( new THREE.Color(0,0,0));
        particleGeom.colors.push( new THREE.Color(0,0,0));

        mapPoints += particleGeom.vertices.length;

        // read additional properties
        // var properties = this.scan('float', header.n_properties);

        // append this track to our fibers list
        particlePoints.merge(particleGeom);
        for(var k = 0; k < particleGeom.colors.length; k++)
            particlePoints.colors.push(particleGeom.colors[k]);
    } // end of loop through all tracks


    //create texture for particle map

    //calculate width of particle map texture
    object._mapWidth = Math.pow(2,Math.ceil(Math.log(Math.sqrt(mapArray.length/4))/Math.LN2));
    console.log(object._mapWidth);
    //create static array, for conversion into texture
    var mapStaticArray = new Float32Array(object._mapWidth*object._mapWidth*4);
    for(var j = 0; j < mapArray.length;j+=4)
    {
        mapStaticArray[(object._mapWidth*(object._mapWidth-Math.floor(j/object._mapWidth/4)-1)+(j/4)%object._mapWidth)*4+0] = mapArray[j+0];
        mapStaticArray[(object._mapWidth*(object._mapWidth-Math.floor(j/object._mapWidth/4)-1)+(j/4)%object._mapWidth)*4+1] = mapArray[j+1];
        mapStaticArray[(object._mapWidth*(object._mapWidth-Math.floor(j/object._mapWidth/4)-1)+(j/4)%object._mapWidth)*4+2] = mapArray[j+2];
        mapStaticArray[(object._mapWidth*(object._mapWidth-Math.floor(j/object._mapWidth/4)-1)+(j/4)%object._mapWidth)*4+3] = mapArray[j+3];
    }
    console.log('mapArray', mapArray);
    console.log(mapStaticArray)

    //convert static array into texture
    var mapTexture = new THREE.DataTexture( mapStaticArray, object._mapWidth, object._mapWidth, THREE.RGBAFormat, THREE.FloatType );
    mapTexture.minFilter = THREE.NearestFilter;
    mapTexture.magFilter = THREE.NearestFilter;
    mapTexture.needsUpdate = true;
    object._particleMap = mapTexture;


    //create texture for particle positions

    //calculate width of particle position texture
    object._coordinateWidth = Math.pow(2,Math.ceil(Math.log(Math.sqrt(mapPoints))/Math.LN2));

    //create static array
    var pointsStaticArray =  new Float32Array(object._coordinateWidth*object._coordinateWidth*3);
    for(var j = 0; j < mapPoints; j++)
    {
        pointsStaticArray[(object._coordinateWidth*(object._coordinateWidth-Math.floor(j/object._coordinateWidth)-1)+j%object._coordinateWidth)*3+0] = particlePoints.vertices[j].x;
        pointsStaticArray[(object._coordinateWidth*(object._coordinateWidth-Math.floor(j/object._coordinateWidth)-1)+j%object._coordinateWidth)*3+1] = particlePoints.vertices[j].y;
        pointsStaticArray[(object._coordinateWidth*(object._coordinateWidth-Math.floor(j/object._coordinateWidth)-1)+j%object._coordinateWidth)*3+2] = particlePoints.vertices[j].z;
    }
    console.log(pointsStaticArray);
    console.log(particlePoints.vertices)
    //convert static array into textures
    var particleTexture = new THREE.DataTexture( pointsStaticArray, object._coordinateWidth, object._coordinateWidth, THREE.RGBFormat, THREE.FloatType );
    particleTexture.minFilter = THREE.NearestFilter;
    particleTexture.magFilter = THREE.NearestFilter;
    particleTexture.needsUpdate = true;
    object._particleLocations = particleTexture;

    //create fiber Object3D
    fiberPoints.computeBoundingBox();
    fiberPoints.computeFaceNormals();
    fiberPoints.computeVertexNormals();
    console.log(fiberPoints.colors.length, fiberPoints.vertices.length);
    var material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
    object._fiberContainer = new THREE.Line(fiberPoints, material, THREE.LinePieces);

    //create particle geometry
    var particleSystemGeometry = new THREE.Geometry();

    var l;
    for (  i = 0, l = mapArray.length/4; i < l; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = ( i % object._mapWidth ) / object._mapWidth ;
        vertex.y = Math.floor( i / object._mapWidth ) / object._mapWidth;
        particleSystemGeometry.vertices.push( vertex );

    }

    object._numParticles = mapArray.length;

    //create particle material and attach shader
    var particleSystemMaterial = new THREE.ShaderMaterial( {

        uniforms: {

            "map": { type: "t", value: object._particleMap },
            "bigMap": { type: "t", value: object._particleLocations },
            "width": { type: "f", value: object._mapWidth },
            "bigWidth": { type: "f", value: object._coordinateWidth },

        },
        vertexShader: DVT.ParticleRenderV,
        fragmentShader: DVT.ParticleCurveColorF,
       // blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        transparent: true

    } );

    object._renderMaterial = particleSystemMaterial;

    //create and assign particle system Object3D
    object._currentParticles = new THREE.PointCloud( particleSystemGeometry, particleSystemMaterial );

    // TODO move tracks to RAS space (note: we switch from row-major to column-major by transposing)
    //DVT.matriDVT.transpose(header.vox_to_ras, object._transform._matrix);

    // the object should be set up here, so let's fire a modified event
    object.THREEContainer = new THREE.Object3D();
    object.THREEContainer.add(object._fiberContainer);
    object.THREEContainer.add(object._currentParticles);
    object._fiberContainer.visible = object._fibersVisible;
    object._currentParticles.visible = object._particlesVisible;
    object._loaded = true;
    object._locked = false;
    object.dispatchEvent({type: 'PROCESSED', target: object});

};



// export symbols (required for advanced compilation)
goog.exportSymbol('DVT.parserTRK', DVT.parserTRK);
goog.exportSymbol('DVT.parserTRK.prototype.parse', DVT.parserTRK.prototype.parse);