(function() {
  'use strict';
  const glob = require('glob');
  const gulp = require('gulp');

  const util = require('gulp-util');

  const runSequence = require('run-sequence');

  const clean = require('gulp-rimraf'); //does rm -rf

  const bump = require('gulp-bump');
  const header = require('gulp-header'); //adds a header to file
  const pkg = require('./package.json');

  const babelify = require('babelify'); //es2015
  const browserify = require('browserify'); // Bundles JS
  const buffer = require('vinyl-buffer');
  const concat = require('gulp-concat'); //Concatenates files
  const connect = require('gulp-connect'); //Runs a local dev server

  const jshint = require('gulp-jshint'); //Lint JS files

  const open = require('gulp-open'); //Open a URL in a web browser
  const os = require('os');// node extension to get OS methods
  const plumber = require('gulp-plumber');// monkey-patch for occurs in gulp sometimes, apparently
  const rename = require('gulp-rename'); // file renamer
  const source = require('vinyl-source-stream'); // Use conventional text streams with Gulp

  const sass = require('gulp-sass'); //build Sass
  const sourcemaps = require('gulp-sourcemaps'); //adds sourcemaps to files
  const postcss = require('gulp-postcss'); //does stuff to css after its been gen.
  const autoprefixer = require('autoprefixer'); //auto prefixes old css

  const config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
      entry: './src/js/app.js',
      html: './src/**/*.html',
      css: './src/css/',
      js: './src/js/**/*.js',
      vendor: './src/vendor/**/*.js',
      fonts: './src/fonts/**/*.*',
      sass: './src/scss/**/*.scss',
      dist: './dist'
    },
    fontIconsName: 'fonticons',
    prd: !!util.env.prd
  };

  const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


  // create server
  gulp.task('connect', () => {
    connect.server({
      root: config.paths.dist,
      port: config.port,
      base: config.devBaseUrl,
      livereload: true
    });
  });

  // open entry point
  gulp.task('open', ['connect'], () => {
    gulp.src(config.paths.dist + '/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
  });

  // jshint
  gulp.task('jshint', () => {
    return gulp.src(config.paths.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

  // JS: babelify > bundle > copy to dist
  gulp.task('js', () => {
    let bundler = browserify({
        entries: config.paths.entry,
        debug: true
    });

    bundler.transform(babelify, {presets: ['es2015']});
    bundler.bundle()
      .on('error', (err) => { console.error(err); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(config.prd ? util.noop() : sourcemaps.init({ loadMaps: true }))
      .pipe(config.prd ? uglify() : util.noop()) // Use any gulp plugins you want now
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(config.prd ? util.noop() : sourcemaps.write('./'))
      .pipe(gulp.dest(config.paths.dist + '/assets/scripts'))
      .pipe(connect.reload());
  });

  gulp.task('sass', () => {
      gulp.src(config.paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist + '/assets/css/'))
        .pipe(connect.reload());
  });

  gulp.task('fonts', () => {
    return gulp.src(config.paths.fonts)
      .pipe(gulp.dest(config.paths.dist + '/assets/fonts/'));
  });

  gulp.task('vendor', () => {
    return gulp.src(config.paths.vendor)
      .pipe(gulp.dest(config.paths.dist + '/assets/scripts/vendor/'));
  });

  gulp.task('html', () => {
    return gulp.src(config.paths.html)
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload());
  });

  gulp.task('bump', () => {
    return gulp.src('./package.json')
      .pipe(bump())
      .pipe(gulp.dest('./'));
  });

  gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.js, ['js', 'jshint']);
  });

  gulp.task('default', [
    'js',
    'fonts',
    'sass',
    'html',
    'open',
    'watch'
  ]);

  gulp.task('build', [
    'js',
    'fonts',
    'sass',
    'vendor',
    'html'
  ]);

})();
