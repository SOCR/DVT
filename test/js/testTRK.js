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
    fibers3.file = 'http://x.babymri.org/?cctracks.trk';

    // add the object
    test_renderer.add(fibers);
    test_renderer.add(fibers2);
    test_renderer.add(fibers3);

    // .. and render it
    test_renderer.render();

    fibers2.showFibers(false);
    fibers3.showParticles(true);
    fibers3.enableAnimation(true);
    fibers3.showFibers(false);
    fibers2.showParticles(true);
};
