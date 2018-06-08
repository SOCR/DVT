/**
 * Created by shusa_000 on 9/21/2015.
 */

goog.provide('DVT.mesh');

goog.require('DVT.loaded');
goog.require('THREE');
goog.require('voxelize');
goog.require('DVT.parserGIF');

/**
 * Class representing dMRI-generated tractography data
 * @param copyFrom Object to copy properties from
 * @extends DVT.loaded
 * @constructor
 */

DVT.mesh = function(copyFrom) {
    goog.base(this, 'constructor', copyFrom);

    /**
     * THREE.js renderer associated with the object
     * @type {!THREE.renderer}
     * @private
     */
    this._renderer = null;


    /**
     * private variable telling whether mesh is visible. Default: false
     * @type {boolean}
     * @private
     */
    this._meshVisible = true;
    
    this._expandAnimate = false;
    
    
    this._voronoiSystem = null;
    
    this._voronoiIndex = 0;
    this._voronoiContainer = null;
    this._voxelResolution = 0;

};
goog.inherits(DVT.mesh, DVT.loaded);

/**
 * sets visibility of mesh on/off
 * @param status {bool} indicator to show/hide mesh
 */
DVT.mesh.prototype.showMesh = function (status) {
    if(this.THREEContainer) {
        if (status) {
            this.THREEContainer.visible = true;
        } else {
            this.THREEContainer.visible = false;
        }
    }
    this._meshVisible = status;
};

DVT.mesh.prototype.init = function (renderer) {
    this._renderer = renderer;
    
    if(this._voronoiSystem)
    {
        this.calcVoronoi();
    }
    this._voxelize();
};

DVT.mesh.prototype.calcVoronoi = function()
{
    console.log(this._voronoiSystem);
    var geomClone = this._voronoiContainer.geometry.clone();
    var geom = new THREE.Geometry().fromBufferGeometry( geomClone );
    delete geomClone;
    var curPoint = this._voronoiSystem[this._voronoiIndex]
    for(var j=0;j<this._voronoiSystem.length;j++)
    {
        if(j!=this._voronoiIndex)
        {
            var normal = new THREE.Vector3(curPoint.x, curPoint.y, curPoint.z);
            normal.sub(this._voronoiSystem[j]);
            normal.divideScalar(2);
            
            var plane = new THREE.Plane(normal, 0);
            
            normal = new THREE.Vector3(curPoint.x, curPoint.y, curPoint.z);
            
            
            normal.add(this._voronoiSystem[j]);
            normal.divideScalar(2);
            
            plane.translate(normal);
            
            geom = sliceGeometry(geom, plane, true);
            
            geom.computeFaceNormals();
            geom.computeVertexNormals();
        }
    }
    geom.computeFaceNormals();
    geom = new THREE.BufferGeometry().fromGeometry(geom);
    //create material
    var material = new THREE.MeshPhongMaterial({color:this._color});

    this.THREEContainer = new THREE.Mesh(geom, material);
    
};


DVT.mesh.prototype.voxelize = function(resolution)
{
    resolution = resolution||10;
    this._voxelResolution = resolution;
}


DVT.mesh.prototype._voxelize = function()
{
    if(this._voxelResolution>0)
    {
        var faceArray = this.THREEContainer.geometry.faces.map(x => [x.a,x.b,x.c]);
        var vertexArray = this.THREEContainer.geometry.vertices.map(x => [x.x,x.y,x.z]);
        var binArray = voxelizer(faceArray,vertexArray,this._voxelResolution);
        faceArray = null;
        vertexArray = null;
        console.log(binArray);
        var geometry = DVT.parserGIF.prototype._parseVoxels(binArray.voxels.data, binArray.voxels.shape);

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.scale(this._voxelResolution,this._voxelResolution,this._voxelResolution)
        geometry.translate(binArray.origin[0],binArray.origin[1],binArray.origin[2]);
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
        var material = new THREE.MeshPhongMaterial({color:this._color});

        this.THREEContainer = new THREE.Mesh(geometry, material);
    }
};