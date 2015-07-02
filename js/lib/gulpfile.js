/**
 * Created by shusa_000 on 6/30/2015.
 */
"use strict";

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var closure = require('gulp-closure-compiler');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(['../../css/**/*.scss', '!./node_modules/**', '!./bower_components/**'])
        .pipe(sass())
        .pipe(gulp.dest('../../dist'));
});

gulp.task('closure', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**', '!./bower_components/**'])
        .pipe(closure({
            compilerPath: 'bower_components/closure-compiler/lib/vendor/compiler.jar',
            fileName: 'DVT.js',
            compilerFlags: {
                closure_entry_point: ['DVT.renderer3D', 'DVT.renderer2D'],
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                only_closure_dependencies: true,
                warning_level: 'VERBOSE'
            }
        }))
        .pipe(gulp.dest('../../dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['../**/*.js', '!./node_modules/**'], ['lint', 'closure']);
    gulp.watch(['../../css/**/*.css', '!./node_modules/**'], ['sass']);
});
