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
    var fibers = new X.fibers();
    fibers.file = 'data/smalltrack.trk';

    // add the object
    test_renderer.add(fibers);

    // .. and render it
    test_renderer.render();

};
