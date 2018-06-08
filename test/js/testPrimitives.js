/**
 * Created by shusa_000 on 9/21/2015.
 */
test = function() {
    console.log('pre-rimport renderer3D');
    // create a new test_renderer
    test_renderer = new DVT.renderer3D();
    console.log('pre-init');
    test_renderer.init();


    var sphere = new DVT.sphere();

    sphere.radius = 20;
    sphere._color = 0xaa33ff
    sphere.voxelize(1);

    test_renderer.add(sphere);

    // .. and render it
    test_renderer.render();
};
