var gulp       = require('gulp'),
    recess     = require('gulp-recess'),
    less       = require('gulp-less'),
    livereload = require('gulp-livereload'),
    serve      = require('serve-static');

var paths = {
  less: ['src/**/*.less'],
  dist: 'dist/'
};

gulp.task('server', function (next) {
  var connect = require('connect'),
      server = connect();
  server.use(serve('./')).listen(process.env.PORT || 4000, next);
});

gulp.task('build', function () {
  return gulp.src('src/clean.less')
    .pipe(recess())
    .pipe(less({ compress: true }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['server'], function () {
  livereload.listen();
  gulp.watch(paths.less, ['build']);
  gulp.watch(paths.dist + '**').on('change', livereload.changed);
});

gulp.task('default', ['build']);
