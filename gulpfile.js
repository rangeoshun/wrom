var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var del = require('del');
var spawn = require('child_process').spawn;
var node;

gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['./build/server/server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('default', function() {
  gulp.run('build');

  watch('./src/*', function() {
    gulp.run('build');
  });
});

process.on('exit', function() {
    if (node) node.kill();
})

gulp.task('clean', function () {
  console.log('Updated, rebuilding...');
  return del(['./build/*', './dist/*']);
});

gulp.task('build-server', function () {
  console.log('Rebuilding server...');

  return gulp
    .src([
      'src/global.es6',
      'src/diff.es6',
      'src/tick.es6',
      'src/pixel.es6',
      'src/entity.es6',
      'src/point.es6',
      'src/worm.es6',
      'src/game.es6',
      'src/server.es6'
    ])
    .pipe(concat('server.es6'))
    .pipe(gulp.dest('build/server/'))
    .on('end', function () {
      return gulp
        .src('build/server/server.es6')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('build/server/'))
        .on('end', function () {
          gulp.run('server');
        });
    });
});

gulp.task('build-client', function () {
  console.log('Rebuilding client...');

  return gulp
    .src([
      'src/global.es6',
      'src/tick.es6',
      'src/render.es6',
      'src/pixel.es6',
      'src/entity.es6',
      'src/point.es6',
      'src/worm.es6',
      'src/game.es6',
      'src/client.es6'
    ])
    .pipe(concat('client.es6'))
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
              .src('src/*.ico')
              .pipe(gulp.dest('build/client/'));
            gulp
              .src('src/*.html')
              .pipe(gulp.dest('build/client/'));
          });
    });
});

gulp.task('build', ['clean', 'build-client', 'build-server'], function () {
  console.log('Done, launching server...');
});
