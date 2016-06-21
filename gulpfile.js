var gulp       = require('gulp');
var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var rollup     = require('gulp-rollup');
var gutil      = require('gulp-util');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var babelify   = require('babelify');
var uglify     = require('gulp-uglify');
var server     = require('gulp-server-livereload');

gulp.task('build:node', function () {
  prepareNode()
    .pipe(concat('beautapi-node.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:node:min', function () {
  prepareNode()
    .pipe(concat('beautapi-node.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:bower', function () {
  prepareBower()
    .pipe(source('beautapi-bower.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:bower:min', function() {
  prepareBower()
    .pipe(source('beautapi-bower.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:example:es6', function () {
  return browserify({
    entries: 'examples/es6/index.es6',
    debug: true,
    transform: ['babelify']
  })
    .bundle()
    .pipe(source('__compiled.js'))
    .pipe(buffer())
    .pipe(gulp.dest('examples/es6'));
});

gulp.task('server', function() {
  gulp.src('')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('build',    ['build:node', 'build:node:min', 'build:bower', 'build:bower:min']);
gulp.task('examples', ['build:example:es6']);

function prepareBower() {
  return browserify({
    entries: 'src/bower.js',
    debug: true,
    transform: ['babelify']
  }).bundle()
}

function prepareNode() {
  return gulp.src('src/index.js', { read: false })
    .pipe(rollup({exports: 'default'}))
    .on('error', gutil.log)
    .pipe(babel({plugins: ['add-module-exports']}))
}