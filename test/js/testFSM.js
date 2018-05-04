/**
 * Created by shusa_000 on 9/21/2015.
 */
test = function() {
    console.log('pre-rimport renderer3D');
    // create a new test_renderer
    test_renderer = new DVT.renderer3D();
    console.log('pre-init');
    test_renderer.init();


    var lh = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh.file = 'data/cell1.off';
    // change the color to a smooth red
    lh.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh.opacity = 0.6;
    var lh2 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh2.file = 'data/cell2.off';
    // change the color to a smooth red
    lh2.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh2.opacity = 0.6;
    var lh3 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh3.file = 'data/cell3.off';
    // change the color to a smooth red
    lh3.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh3.opacity = 0.6;
    var lh4 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh4.file = 'data/cell4.off';
    // change the color to a smooth red
    lh4.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh4.opacity = 0.6;


    var porsche = new DVT.mesh();
    // .. and associate the .stl to it
    porsche.file = 'http://x.babymri.org/?porsche.stl';
    // activate the magic mode which results in a colorful rendering since the
    // point colors are based on the point position
    porsche.magicmode = true;
    // set a caption which appears on mouseover
    porsche.caption = 'The magic Porsche!';

    var molecule = new DVT.mesh();
    // .. and associate the .stl to it
    molecule.file = 'data/buckyball.pdb';

    var molecule2 = new DVT.mesh();
    // .. and associate the .stl to it
    molecule2.file = 'data/cholesterol.pdb';



    cube = new DVT.sphere();

    // setting the edge length can also be skipped since 20 is the default
    cube.radius= 100;

    // can also be skipped since [0,0,0] is the default center
    cube.center = [-30, -30, -300];

    // [1,1,1] (== white) is also the default so this can be skipped aswell
    cube.color = [1, 1, 1];

    //test_renderer.add(cube);
    //test_renderer.add(porsche);
    test_renderer.add(lh);
    test_renderer.add(lh2);
    test_renderer.add(lh3);
    test_renderer.add(lh4);
    //test_renderer.add(molecule);
    //test_renderer.add(molecule2);

    // .. and render it
    test_renderer.render();
};
