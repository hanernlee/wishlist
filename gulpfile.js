/*eslint-env node*/
var gulp = require('gulp');
var runSync = require('run-sequence');
var plugin = {};

plugin.server = require('browser-sync').create();
plugin.rename = require('gulp-rename');
plugin.sass = require('gulp-sass');
plugin.autoprefixer = require('gulp-autoprefixer');
plugin.eslint = require('gulp-eslint');

gulp.task('sass', sass);
gulp.task('lint', lint);
gulp.task('serve', serve);
gulp.task('refresh', refresh);
gulp.task('watch', watch);
gulp.task('default', ['watch']);

function refresh() {
  plugin.server.stream();
}

function watch() {
  gulp.watch('./scss/**/*.scss', function() {
    runSync('sass', 'refresh');
  });
  gulp.watch('./views/home.ejs').on('change', plugin.server.reload);
  gulp.watch('./views/_items.ejs').on('change', plugin.server.reload);
  gulp.watch('./views/index.ejs').on('change', plugin.server.reload);
}

function serve() {
  plugin.server.init({
    port: 3000,
    server: './'
  });
}

function sass() {
  gulp.src('./scss/main.scss')
  .pipe( plugin.sass() )
  .on('error', function(error) {
    console.log(error);
    this.end();
  })
  .pipe( plugin.autoprefixer() )
  .pipe( plugin.rename('bundle.css') )
  .pipe( gulp.dest('public/bundle') )
  .pipe( plugin.server.stream() );
}

function lint() {
  gulp.src(['./js/**/*.js', './gulpfile'])
    .pipe( plugin.eslint() )
    .pipe( plugin.eslint.format() );
}
