var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var del = require('del');
var spawn = require('child_process').spawn;
var replace = require('gulp-replace');
var closure = require('gulp-closure-compiler-service');

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
  return del(['./build/*']);
});

gulp.task('dist', function () {
  if (live) live.kill();
  var devPort = new RegExp(':'+ config.dev.socket, 'g');
  var devWWW = new RegExp(config.dev.www, 'g');
  console.log(devPort);
  del(['./dist/*']);
  return gulp
    .src(['build/**/*.js', 'build/**/*.html', 'build/**/*.ico'])
    .pipe(replace(devPort, ':'+ config.live.socket))
    .pipe(replace(devWWW, config.live.www))
    .pipe(gulp.dest('dist/'))
      .on('end', function () {
        gulp
          .src('dist/client/client.js')
          .pipe(gulp.dest('dist/client/'))
            .on('end', function () {
              gulp.run('live-server');
            });
      });;
});

gulp.task('build-server', function () {
  console.log('Rebuilding server...');

  return gulp
    .src([
      'src/shared/global.es6',
      'src/shared/diff.es6',
      'src/shared/tick.es6',
      'src/shared/pixel.es6',
      'src/shared/entity.es6',
      'src/shared/point.es6',
      'src/shared/worm.es6',
      'src/shared/game.es6',
      'src/server/server.es6'
    ])
    .pipe(concat('server.es6'))
    .pipe(replace(/{{www}}/g, config.dev.www))
    .pipe(gulp.dest('build/server/'))
    .on('end', function () {
      return gulp
        .src('build/server/server.es6')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('build/server/'))
        .on('end', function () {
          gulp.run('dev-server');
        });
    });
});

gulp.task('build-client', function () {
  console.log('Rebuilding client...');

  return gulp
    .src([
      'src/shared/global.es6',
      'src/shared/tick.es6',
      'src/shared/pixel.es6',
      'src/shared/entity.es6',
      'src/shared/point.es6',
      'src/shared/worm.es6',
      'src/shared/game.es6',
      'src/client/render.es6',
      'src/client/client.es6'
    ])
    .pipe(concat('client.es6'))
    .pipe(replace(/{{socket}}/g, config.dev.socket))
    .pipe(gulp.dest('build/client/'))
    .on('end', function () {
      return gulp
        .src('build/client/client.es6')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('build/client/'))
          .on('end', function () {
            gulp
              .src('src/client/*.ico')
              .pipe(gulp.dest('build/client/'));
            gulp
              .src('src/client/*.html')
              .pipe(gulp.dest('build/client/'));
          });
    });
});

gulp.task('build', ['clean', 'build-client', 'build-server'], function () {
  console.log('Done, launching server...');
});
