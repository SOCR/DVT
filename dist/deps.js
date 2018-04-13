// This file was autogenerated by gulp-closure-deps plugin.
// Please do not edit.
goog.addDependency('../../../../../../js/DVT.js', ['DVT'], ['jQuery'], false);
goog.addDependency('../../../../../../js/core/base.js', ['DVT.base'], ['DVT', 'goog.events', 'goog.events.EventTarget'], false);
goog.addDependency('../../../../../../js/events/eventsCore.js', ['DVT.eventCore'], [], false);
goog.addDependency('../../../../../../js/io/loader/listeners.js', ['DVT.listeners'], [], false);
goog.addDependency('../../../../../../js/io/loader/loadHelper.js', ['DVT.loadHelper'], ['DVT', 'DVT.parserFSM', 'DVT.parserPDB', 'DVT.parserSTL', 'DVT.parserTRK', 'ProgressBar', 'bootstrap', 'goog.events'], false);
goog.addDependency('../../../../../../js/io/loader/loader.js', ['DVT.loader'], ['DVT', 'DVT.loadHelper', 'jQuery'], false);
goog.addDependency('../../../../../../js/io/parser/parser.js', ['DVT.parser'], ['DVT.base'], false);
goog.addDependency('../../../../../../js/io/parser/parserFSM.js', ['DVT.parserFSM'], ['DVT.parser', 'THREE'], false);
goog.addDependency('../../../../../../js/io/parser/parserPDB.js', ['DVT.parserPDB'], ['DVT.parser', 'THREE', 'THREE.PDBUtil'], false);
goog.addDependency('../../../../../../js/io/parser/parserSTL.js', ['DVT.parserSTL'], ['DVT.parser', 'THREE'], false);
goog.addDependency('../../../../../../js/io/parser/parserTRK.js', ['DVT.parserTRK'], ['DVT.parser', 'DVT.shader', 'THREE'], false);
goog.addDependency('../../../../../../js/io/parser/parserVTK.js', ['DVT.parserVTK'], ['DVT.parser', 'THREE'], false);
goog.addDependency('../../../../../../js/lib/EdgesGeometry.js', ['THREE.EdgesGeometry'], ['THREE'], false);
goog.addDependency('../../../../../../js/lib/FBOUtils.js', ['THREE.FBOUtils'], ['THREE'], false);
goog.addDependency('../../../../../../js/lib/OrbitControls.js', ['orbitControls'], [], false);
goog.addDependency('../../../../../../js/lib/PDBUtil.js', ['THREE.PDBUtil'], [], false);
goog.addDependency('../../../../../../js/lib/bootstrap.min.js', ['bootstrap'], [], false);
goog.addDependency('../../../../../../js/lib/jquery.min.js', ['jQuery'], [], false);
goog.addDependency('../../../../../../js/lib/progressbar.min.js', ['ProgressBar'], [], false);
goog.addDependency('../../../../../../js/lib/slice.min.js', ['THREE.slice'], ['THREE'], false);
goog.addDependency('../../../../../../js/lib/three.min.js', ['THREE'], [], false);
goog.addDependency('../../../../../../js/objects/box.js', ['DVT.box'], ['DVT.primitives', 'THREE.slice'], false);
goog.addDependency('../../../../../../js/objects/fiber.js', ['DVT.fiber'], ['DVT.loaded', 'DVT.shader', 'THREE', 'THREE.FBOUtils'], false);
goog.addDependency('../../../../../../js/objects/loaded.js', ['DVT.loaded'], ['DVT.object'], false);
goog.addDependency('../../../../../../js/objects/mesh.js', ['DVT.mesh'], ['DVT.loaded', 'THREE'], false);
goog.addDependency('../../../../../../js/objects/object.js', ['DVT.object'], ['DVT.base'], false);
goog.addDependency('../../../../../../js/objects/particles.js', ['DVT.particles'], ['DVT.primitives'], false);
goog.addDependency('../../../../../../js/objects/primitives.js', ['DVT.primitives'], ['DVT.loaded', 'THREE.EdgesGeometry'], false);
goog.addDependency('../../../../../../js/objects/sphere.js', ['DVT.sphere'], ['DVT.primitives'], false);
goog.addDependency('../../../../../../js/visualizaion/renderer.js', ['DVT.renderer'], ['DVT.base', 'DVT.loader', 'goog.dom', 'goog.events'], false);
goog.addDependency('../../../../../../js/visualizaion/renderer2D.js', ['DVT.renderer2D'], ['DVT.renderer'], false);
goog.addDependency('../../../../../../js/visualizaion/renderer3D.js', ['DVT.renderer3D'], ['DVT.renderer', 'THREE', 'orbitControls'], false);
goog.addDependency('../../../../../../js/visualizaion/shader.js', ['DVT.shader'], [], false);