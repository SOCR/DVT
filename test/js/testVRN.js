/**
 * Created by shusa_000 on 3/29/2018.
 */
test = function() {
    console.log('pre-rimport renderer3D');
    // create a new test_renderer
    test_renderer = new DVT.renderer3D();
    console.log('pre-init');
    test_renderer.init();

    
    
    
setTimeout(function() {
    
    var fromCopy =[];
    this._length = 100;
    var numPoints = 10;
    for(var j=0;j<numPoints;j++)
    {
        fromCopy.push(new THREE.Vector3((Math.random()-.5)*this._length,(Math.random()-.5)*this._length,(Math.random()-.5)*this._length))
    }
    for(var j=0;j<numPoints;j++)
    {
        var littleCube = new DVT.box();

    // setting the edge length can also be skipped since 20 is the default
    littleCube.lengthX = littleCube.lengthY = littleCube.lengthZ = 130;

    // can also be skipped since [0,0,0] is the default center
    littleCube.center = [0, 0,0];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    littleCube._color = Math.random()*0xffffff;
    
    
    
    littleCube._voronoiIndex =j;
    littleCube._voronoiSystem = fromCopy;
    
    
    test_renderer.add(littleCube);
    }
    
}, 4000);
    cube = new DVT.box();

    // setting the edge length can also be skipped since 20 is the default
    cube.lengthX = cube.lengthY = cube.lengthZ = 130;

    // can also be skipped since [0,0,0] is the default center
    cube.center = [0, 0, 0];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    cube._color = 0xaa2288;
    
    
    //test_renderer.add(cube);
};
