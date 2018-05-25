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
    lh.file = "data/gif1.gif";
    // change the color to a smooth red
    lh.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh.opacity = 0.6;
    var lh2 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh2.file = 'data/gif2.gif';
    // change the color to a smooth red
    lh2.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh2.opacity = 0.6;
    var lh3 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh3.file = 'data/gif3.gif';
    // change the color to a smooth red
    lh3.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh3.opacity = 0.6;
    var lh4 = new DVT.mesh();
    // .. attach a Freesurfer .smoothwm mesh
    lh4.file = 'data/gif4.gif';
    // change the color to a smooth red
    lh4.color = [0.7, 0.2, 0.2];
    // add some transparency
    lh4.opacity = 0.6;


    //test_renderer.add(lh);
    //test_renderer.add(lh2);
    //test_renderer.add(lh3);
    test_renderer.add(lh4);

    // .. and render it
    test_renderer.render();
};
