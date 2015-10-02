/**
 * Created by shusa_000 on 7/7/2015.
 */
test = function() {
    console.log('pre-rimport renderer3D');
    // create a new test_renderer
    test_renderer = new DVT.renderer3D();
    console.log('pre-init');
    test_renderer.init();

    // load a .trk file
    var fibers = new DVT.fiber();
    fibers.file = 'data/smalltrack.trk';

    var fibers2 = new DVT.fiber();
    fibers2.file = 'data/fibers.trk';

    var fibers3 = new DVT.fiber();
    fibers3.file = 'http://x.babymri.org/?streamline.trk';

    // add the object
    test_renderer.add(fibers);
    test_renderer.add(fibers2);
    //test_renderer.add(fibers3);

    cube = new DVT.box();

    // setting the edge length can also be skipped since 20 is the default
    cube.lengthX = cube.lengthY = cube.lengthZ = 100;

    // can also be skipped since [0,0,0] is the default center
    cube.center = [-30, -30, -300];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    cube.color = [1, 1, 1];

    test_renderer.add(cube);
    // .. and render it


    var lh = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh.file = 'http://x.babymri.org/?lh.smoothwm';
    // change the color to a smooth red
    lh.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh.opacity = 0.6;


    var porsche = new DVT.mesh();
    // .. and associate the .stl to it
    porsche.file = 'http://x.babymri.org/?porsche.stl';
    // activate the magic mode which results in a colorful rendering since the
    // point colors are based on the point position
    porsche.magicmode = true;
    // set a caption which appears on mouseover
    porsche.caption = 'The magic Porsche!';


    cube = new DVT.box();

    // setting the edge length can also be skipped since 20 is the default
    cube.lengthX = cube.lengthY = cube.lengthZ = 100;

    // can also be skipped since [0,0,0] is the default center
    cube.center = [-30, -30, -300];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    cube.color = [1, 1, 1];

    test_renderer.add(cube);
    test_renderer.add(porsche);
    test_renderer.add(lh);

    test_renderer.render();

    fibers2.showFibers(false);
    fibers2.showParticles(true);
    fibers3.enableAnimation(true);

    fibers3.showParticles(false);
    fibers3.enableAnimation(true);
    fibers3.showFibers(true);

    fibers.showParticles(true);
    fibers.enableAnimation(true);
    fibers.showFibers(false);
};