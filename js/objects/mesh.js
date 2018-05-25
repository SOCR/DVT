/**
 * Created by shusa_000 on 9/21/2015.
 */

goog.provide('DVT.mesh');

goog.require('DVT.loaded');
goog.require('THREE');

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
    
}