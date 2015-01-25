var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');

var paths = {
  markup: 'frontend/index.html',
  less: 'frontend/style/*.less',
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

gulp.task('watch', function() {
  gulp.watch(paths.markup, ['markup']);
  gulp.watch(paths.less, ['less']);
});

gulp.task('default', ['watch', 'markup', 'less']);
