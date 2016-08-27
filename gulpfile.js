var gulp = require('gulp'),
  del = require('del'),
  merge = require('merge2'),
  sass = require('node-sass'),
  watch = require('gulp-watch'),
  ts = require('gulp-typescript'),
  rename = require('gulp-rename'),
  flatten = require('gulp-flatten'),
  sourcemaps = require('gulp-sourcemaps'),
  inlineNg2Template = require('gulp-inline-ng2-template');

var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

gulp.task('copy', function() {
  return gulp.src(['./node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css'])
    .pipe(rename('perfect-scrollbar.component.css'))
    .pipe(gulp.dest('src'));
});

gulp.task('build', function() {
  var tsResult = gulp.src(['src/**/*.*ts', 'node_modules/@types/**/*.d.ts'], {
      base: 'src'
    })
    .pipe(sourcemaps.init())
    .pipe(inlineNg2Template({ base: 'src' }))
    .pipe(ts(tsProject));

  return merge([
    tsResult.dts
    .pipe(flatten())
    .pipe(gulp.dest('lib')),
    tsResult.js
    .pipe(flatten())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('lib'))
  ]);
});

gulp.task('clean', function() {
  return del('lib');
});

gulp.task('default', gulp.series('clean', 'copy', 'build'));
