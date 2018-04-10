/**
 * Created by shusa_000 on 3/29/2018.
 */
test = function() {
    console.log('pre-rimport renderer3D');
    // create a new test_renderer
    test_renderer = new DVT.renderer3D();
    console.log('pre-init');
    test_renderer.init();

    
    

    var lh = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh.file = 'http://x.babymri.org/?rh.smoothwm';
    // change the color to a smooth red
    lh.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh.opacity = 0.6;
    lh.showMesh(false);
    test_renderer.add(lh);
    
    
    
    
    
    
    
    setTimeout(function() {
  
    var fromCopy =[];
    this._length = 100;
    this._center=[0, -20, 10];
    var numPoints = 8;
    for(var j=0;j<numPoints;j++)
    {
        fromCopy.push(new THREE.Vector3((Math.random()-.5)*this._length+this._center[0],(Math.random()-.5)*this._length+this._center[1],(Math.random()-.5)*this._length+this._center[2]))
    }
    for(var j=0;j<numPoints-0;j++)
    {
        var littleCube = new DVT.mesh();

    // setting the edge length can also be skipped since 20 is the default
    littleCube.lengthX = littleCube.lengthY = littleCube.lengthZ = 130;

    // can also be skipped since [0,0,0] is the default center
    littleCube.center = [0, -20, 10];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    littleCube._color = Math.random()*0xffffff;
    
    
    littleCube.file = 'none.none';
    littleCube._loaded = true;
    littleCube._loader = {finishRender: function () {}};
    
    littleCube._voronoiIndex =j;
    littleCube._voronoiSystem = fromCopy;
    littleCube._voronoiContainer = lh.THREEContainer;
        
    test_renderer.add(littleCube);
    }
}, 4000);    
    
    

    cube = new DVT.box();

    // setting the edge length can also be skipped since 20 is the default
    cube.lengthX = cube.lengthY = cube.lengthZ = 130;

    // can also be skipped since [0,0,0] is the default center
    cube.center = [0, -20, 10];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    cube._color = 0xaa2288;
    
    
    //test_renderer.add(cube);

};
