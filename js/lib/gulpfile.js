/**
 * Created by shusa_000 on 6/30/2015.
 */


// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
//var closure = require('gulp-closure-compiler');
var rename = require('gulp-rename');
var depsWriter = require('gulp-closure-deps');
var shell = require('gulp-shell');
var yuidoc = require('gulp-yuidoc');
var plumber = require('gulp-plumber');
var plato = require('plato');
var closureCompiler = require('google-closure-compiler').gulp();

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(['../../css/**/*.scss', '!./node_modules/**', '!./bower_components/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gulp.dest('../../dist'));
});

//closure compiler
gulp.task('closureOld', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(closure({
            compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar',
            fileName: 'DVT.js',
            compilerFlags: {
                closure_entry_point: ['DVT.loader', 'DVT.renderer2D'],
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                only_closure_dependencies: true
                //warning_level: 'VERBOSE'
            }
        }))
        .pipe(gulp.dest('../../dist'));
    
    
});

gulp.task('closure', function () {
  return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/jquery/**'], {base: './'})
      .pipe(closureCompiler({
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT6_STRICT',
          language_out: 'ECMASCRIPT5_STRICT',
          output_wrapper: '(function(){\n%output%\n}).call(this)',
          js_output_file: 'DVT.js',
          closure_entry_point: ['DVT.loader', 'DVT.renderer2D'],
          only_closure_dependencies: true
        }))
      .pipe(gulp.dest('../../dist'));
});

//dependency tree generator
gulp.task('deps', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**', '!./closure-library/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(depsWriter({
            fileName: 'deps.js',
            prefix: '../../../../..',
            baseDir: '../../dist'
        }))
        .pipe(gulp.dest('../../dist'));
});

//generate jsdoc documentation
gulp.task( 'jsdoc', shell.task( [
'node ./node_modules/jsdoc/jsdoc ../../js -r -c ./conf.json -a all -d ../../doc'
] ) );

//generate plato code analysis
gulp.task( 'plato', function(){
    var files = ['../../js'];

    var outputDir = '../../doc/stats';
// null options for this example
    var options = {
        exclude: /.*(lib+).*js/,
        recurse: true

    };

    var callback = function (report){
// once done the analysis,
// execute this
    };

    plato.inspect(files, outputDir, options, callback);
} );

//generate yuidoc
gulp.task('yuidoc', function() {
    gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**', '!./closure-library/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(yuidoc())
        .pipe(gulp.dest("../../doc"));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['../**/*.js', '!./node_modules/**'], [ 'closure', 'deps', 'jsdoc']);
    gulp.watch(['../../css/**/*.css', '!./node_modules/**'], ['sass']);
});

gulp.task('default', [  'sass', 'closure', 'deps', 'jsdoc', 'watch']);

gulp.task('publish', [ 'sass', 'closure', 'deps', 'jsdoc', 'plato']);