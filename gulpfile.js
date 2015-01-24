var gulp = require('gulp');
var del = require('del');

var paths = {
  markup: 'frontend/index.html',
  dest: 'resources/'
};

gulp.task('clean', function(cb) {
  del(['resources'], cb);
});

gulp.task('markup', function() {
  return gulp.src(paths.markup)
  .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.markup, ['markup']);
});

gulp.task('default', ['watch', 'markup']);
