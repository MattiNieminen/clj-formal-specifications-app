var gulp = require('gulp');
var del = require('del');

var paths = {
  markup: 'frontend/index.html'
};

gulp.task('clean', function(cb) {
  del(['resources'], cb);
});

gulp.task('markup', ['clean'], function() {
  return gulp.src(paths.markup)
  .pipe(gulp.dest('resources/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.markup, ['markup']);
});

gulp.task('default', ['watch', 'markup']);
