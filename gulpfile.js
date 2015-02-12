var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var less = require('gulp-less');
var react = require('gulp-react');
var download = require('gulp-download');

var paths = {
  markup: 'frontend/index.html',
  style: 'frontend/style/*.less',
  scripts: ['bower_components/react/react.js',
            'bower_components/ace-builds/src/ace.js',
            'bower_components/ace-builds/src/mode-clojure.js',
            'bower_components/ace-builds/src/theme-monokai.js',
            'bower_components/jquery/dist/jquery.js'],
  jsx: 'frontend/scripts/components.js',
  examples: ['https://raw.githubusercontent.com/MattiNieminen/clj-formal-specifications/master/src/clj_formal_specifications/examples/coin.clj',
             'https://raw.githubusercontent.com/MattiNieminen/clj-formal-specifications/master/src/clj_formal_specifications/examples/simple_account.clj',
             'https://raw.githubusercontent.com/MattiNieminen/clj-formal-specifications/master/src/clj_formal_specifications/examples/shared_account.clj'],
  dest: 'resources/public'
};

gulp.task('clean', function(cb) {
  del(['resources'], cb);
});

gulp.task('markup', function() {
  return gulp.src(paths.markup)
  .pipe(gulp.dest(paths.dest));
});

gulp.task('style', function () {
  gulp.src(paths.style)
  .pipe(less())
  .pipe(concat('style.css'))
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

gulp.task('examples', function() {
  return download(paths.examples)
    .pipe(gulp.dest(paths.dest+'/examples'))
});

gulp.task('watch', ['markup', 'style', 'scripts', 'jsx', 'examples'],
    function() {
  gulp.watch(paths.markup, ['markup']);
  gulp.watch(paths.style, ['style']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jsx, ['jsx'])
});

gulp.task('default', ['markup', 'style', 'scripts', 'jsx', 'examples']);
