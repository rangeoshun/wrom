var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var del = require('del');
var spawn = require('child_process').spawn;
var replace = require('gulp-replace');
var closure = require('gulp-closure-compiler-service');
var license = require('gulp-license');
var info = require('./package.json');
var stripDebug = require('gulp-strip-debug');
var browserify = require('gulp-browserify');
var headerfooter = require('gulp-headerfooter');

var config = require('./src/config.json');
var live, dev;

gulp.task('dev-server', function() {
  if (dev) dev.kill()
  dev = spawn('node', ['./build/server/server.js', config.dev.http, config.dev.socket], {stdio: 'inherit'});
  dev.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('live-server', function() {
  if (live) live.kill()
  live = spawn('node', ['./dist/server/server.js', config.live.http, config.live.socket], {stdio: 'inherit'});
  live.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('default', function() {
  gulp.run('build');

  watch(['./src/*', './src/**/*'], function() {
    gulp.run('build');
  });
});

process.on('exit', function() {
    if (dev) dev.kill();
})

gulp.task('clean', function () {
  console.log('Updated, rebuilding...');
  del.sync(['./build/*']);
});

gulp.task('dist', function () {
  if (live) live.kill();
  var devPort = new RegExp(':'+ config.dev.socket, 'g');
  var devWWW = new RegExp(config.dev.www, 'g');

  del(['./dist/*']);

  gulp
    .src(['build/**/*.html', 'build/**/*.ico'])
    .pipe(gulp.dest('dist/'));

  return gulp
    .src(['build/**/*.js'])
    .pipe(replace(devPort, ':'+ config.live.socket))
    .pipe(replace(devWWW, config.live.www))
    .pipe(stripDebug())
/*
    .pipe(closure({
      language: 'ECMASCRIPT5',
      compilation_level: 'SIMPLE_OPTIMIZATIONS'
    }))
*/
    .pipe(license(info.license, {
      tiny: true,
      year: 2016,
      organization: info.repository.url
    }))
    .pipe(gulp.dest('dist/'))
      .on('end', function () {
        gulp.run('live-server');
      });
});

gulp.task('build-server', function () {
  console.log('Rebuilding server...');

  return gulp
    .src([
      'src/shared/*',
      'src/server/*'
    ])
    .pipe(replace(/{{www}}/g, config.dev.www))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(license(info.license, {
      year: 2016,
      organization: info.repository.url
    }))
    .pipe(gulp.dest('build/server/'))
      .on('end', function () {
        gulp.run('dev-server');
      });
});

gulp.task('build-client', function () {
  console.log('Rebuilding client...');
  gulp
    .src(['src/client/*.ico', 'src/client/*.html'])
    .pipe(gulp.dest('build/client/'));

  return gulp
    .src([
      'src/shared/*.es6',
      'src/client/*.es6'
    ])
    .pipe(replace(/{{socket}}/g, config.dev.socket))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build/client/'))
    .on('end', function () {
      gulp.src('build/client/*.js')
        .pipe(browserify({
    		  insertGlobals : true,
    		  debug : true
    		}))
        .pipe(license(info.license, {
          year: 2016,
          organization: info.repository.url
        }))
        .pipe(gulp.dest('build/client/'));
      });
});

gulp.task('build', ['clean', 'build-client', 'build-server'], function () {
  console.log('Done, launching server...');
});
