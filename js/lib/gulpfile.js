/**
 * Created by shusa_000 on 6/30/2015.
 */
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-closure-compiler');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['../**/*.js', '!./node_modules/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(['../../css/**/*.scss', '!./node_modules/**'])
        .pipe(sass())
        .pipe(gulp.dest('../../dist'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['../**/*.js', '!./node_modules/**'], ['lint', 'scripts']);
    gulp.watch(['../**/*.css', '!./node_modules/**'], ['sass']);
});
