/**
 * Created by shusa_000 on 3/29/2018.
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


    // add the object
    test_renderer.add(fibers);

    // .. and render it
    test_renderer.render();


    fibers.showParticles(true);
    fibers.enableAnimation(false);
    fibers.showFibers(false);
};
