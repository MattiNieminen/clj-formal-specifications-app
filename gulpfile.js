var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var less = require('gulp-less');
var react = require('gulp-react');

var paths = {
  markup: 'frontend/index.html',
  less: 'frontend/style/*.less',
  scripts: ['bower_components/react/react.js',
            'bower_components/ace-builds/src/ace.js',
            'bower_components/ace-builds/src/mode-clojure.js',
            'bower_components/ace-builds/src/theme-monokai.js'],
  jsx: 'frontend/scripts/components.js',
  dest: 'resources/public'
};

gulp.task('clean', function(cb) {
  del(['resources'], cb);
});

gulp.task('markup', function() {
  return gulp.src(paths.markup)
  .pipe(gulp.dest(paths.dest));
});

gulp.task('less', function () {
  gulp.src(paths.less)
  .pipe(less())
  .pipe(gulp.dest(paths.dest));
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('jsx', function () {
  return gulp.src(paths.jsx)
    .pipe(react({harmony: true}))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', ['markup', 'less', 'scripts', 'jsx'], function() {
  gulp.watch(paths.markup, ['markup']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jsx, ['jsx'])
});

gulp.task('default', ['markup', 'less', 'scripts', 'jsx']);
